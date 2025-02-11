"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CombinedGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [rounds, setRounds] = useState<{ type: string; length: string }[]>([]);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);
  const [roundTypes, setRoundTypes] = useState<string[]>([]);
  const [roundLengths, setRoundLengths] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [audioBlobs, setAudioBlobs] = useState<{ [key: string]: Blob | null }>(
    {}
  );
  const [scores, setScores] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const extractResponse = await fetch("/api/extract-text", {
          method: "POST",
          body: formData,
        });

        if (!extractResponse.ok) {
          throw new Error("Failed to extract text from resume");
        }

        const extractData = await extractResponse.json();
        const extractedText = extractData.pages
          ?.flatMap((page: any) => page.lines)
          .map((line: any) => line.content)
          .join(" ");

        setResumeText(extractedText);
      } catch (error) {
        console.error(error);
        alert("An error occurred while processing the file.");
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jobDescription || rounds.length === 0) {
      alert("Please provide all required fields.");
      return;
    }

    setLoading(true);
    const currentRoundTypes = rounds.map((round) => round.type);
    const currentRoundLengths = rounds.map((round) => round.length);
    setRoundLengths(currentRoundLengths);
    setRoundTypes(currentRoundTypes);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const generateResponse = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resumeText,
          job: jobDescription,
          roundTypes: currentRoundTypes,
          roundLengths: currentRoundLengths,
          type: "questions",
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate questions");
      }

      const generateData = await generateResponse.json();
      setResult(JSON.parse(generateData.output));
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [question]: answer }));
  };

  const handleAudioRecording = async (question: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlobs((prev) => ({ ...prev, [question]: audioBlob }));
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    } catch (error) {
      console.error("Error recording audio:", error);
      alert(
        "Failed to record audio. Please ensure microphone access is granted."
      );
    }
  };

  const handleRoundTypeChange = (index: number, value: string) => {
    setRounds((prev) =>
      prev.map((round, i) => (i === index ? { ...round, type: value } : round))
    );
  };

  const handleRoundLengthChange = (index: number, value: string) => {
    setRounds((prev) =>
      prev.map((round, i) =>
        i === index ? { ...round, length: value } : round
      )
    );
  };

  const handleAddRound = () => {
    setRounds((prev) => [...prev, { type: "", length: "" }]);
  };

  const handleRemoveRound = (index: number) => {
    setRounds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAnswers = async () => {
    if (!result || Object.keys(answers).length === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/interview-scoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: result,
          answers,
          roundTypes,
          roundLengths,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to score answers");
      }

      const scoreData = await response.json();
      setScores(scoreData.output);
    } catch (error) {
      console.error(error);
      alert("An error occurred while scoring your answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6 space-x-6">
      <div className="w-2/5 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Interview Question Generator
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Resume (PDF or Image):
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Description (Text):
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {rounds.map((round, index) => (
            <div key={index}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Round {index + 1} Type:
                </label>
                <Select
                  onValueChange={(value) => handleRoundTypeChange(index, value)}
                >
                  <SelectTrigger className="mt-1 w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors duration-200">
                    <SelectValue placeholder="Select round type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="Technical"
                      className="p-2 hover:bg-indigo-50"
                    >
                      Technical
                    </SelectItem>
                    <SelectItem
                      value="Behavioral"
                      className="p-2 hover:bg-indigo-50"
                    >
                      Behavioral
                    </SelectItem>
                    <SelectItem
                      value="HR/Phone Screen"
                      className="p-2 hover:bg-indigo-50"
                    >
                      HR/Phone Screen
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Round {index + 1} Length (in minutes):
                </label>
                <Select
                  onValueChange={(value) =>
                    handleRoundLengthChange(index, value)
                  }
                >
                  <SelectTrigger className="mt-1 w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors duration-200">
                    <SelectValue placeholder="Select round length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30" className="p-2 hover:bg-indigo-50">
                      30
                    </SelectItem>
                    <SelectItem value="45" className="p-2 hover:bg-indigo-50">
                      45
                    </SelectItem>
                    <SelectItem value="60" className="p-2 hover:bg-indigo-50">
                      60
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {index !== rounds.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRound(index)}
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                >
                  Remove Round
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddRound}
            className="mt-2 bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
          >
            Add Round
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Generated Questions:</h3>
        {result ? (
          <div className="space-y-4">
            {Object.entries(result).map(([round, details]: [string, any]) => (
              <div key={round} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() =>
                    setExpandedRound(expandedRound === round ? null : round)
                  }
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                >
                  <h4 className="text-lg font-semibold">
                    {round} ({details.time} minutes)
                  </h4>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      expandedRound === round ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedRound === round && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {details.questions.map((question: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <p className="text-gray-700 font-medium">
                            {question.question}
                          </p>
                          <p
                            className={`text-sm font-semibold ${
                              question.difficulty === "easy"
                                ? "text-green-600"
                                : question.difficulty === "medium"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            Difficulty: {question.difficulty}
                          </p>
                          <textarea
                            value={answers[question.question] || ""}
                            onChange={(e) =>
                              handleAnswerChange(
                                question.question,
                                e.target.value
                              )
                            }
                            placeholder="Type your answer here..."
                            rows={3}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleAudioRecording(question.question)
                            }
                            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                          >
                            Record Audio
                          </button>
                          {audioBlobs[question.question] && (
                            <audio controls className="mt-2 w-full">
                              <source
                                src={URL.createObjectURL(
                                  audioBlobs[question.question]!
                                )}
                                type="audio/wav"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No questions generated yet.</p>
        )}
        {result && (
          <div className="mt-6">
            <button
              onClick={handleSubmitAnswers}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Scoring..." : "Submit Answers for Scoring"}
            </button>
          </div>
        )}
      </div>

      {/* Update the scoring results section */}
      {scores && (
        <div className="prose prose-lg prose-gray max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{scores}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
