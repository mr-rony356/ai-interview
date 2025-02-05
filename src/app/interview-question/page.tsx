"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CombinedGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [roundTypes, setRoundTypes] = useState<string[]>([]);
  const [roundLengths, setRoundLengths] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // Store answers for each question
  const [audioBlobs, setAudioBlobs] = useState<{ [key: string]: Blob | null }>(
    {}
  ); // Store audio recordings for each question

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !file ||
      !jobDescription ||
      roundTypes.length === 0 ||
      roundLengths.length === 0
    ) {
      alert("Please provide all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Extract text from the uploaded resume
      const formData = new FormData();
      formData.append("file", file);

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

      // Step 2: Generate questions using the extracted text and job description
      const generateResponse = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: extractedText,
          job: jobDescription,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate questions");
      }

      const generateData = await generateResponse.json();
      setResult(JSON.parse(generateData.output)); // Parse the output JSON string
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
      }, 5000); // Record for 5 seconds (adjust as needed)
    } catch (error) {
      console.error("Error recording audio:", error);
      alert(
        "Failed to record audio. Please ensure microphone access is granted."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6 space-x-6">
      {/* Left Side: Form Fields */}
      <div className="w-2/5 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Interview Question Generator
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resume Upload */}
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

          {/* Job Description */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Round Types:
            </label>
            <Select
              onValueChange={(value) =>
                setRoundTypes((prev) => [...prev, value])
              }
            >
              <SelectTrigger className="mt-1 w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors duration-200">
                <SelectValue placeholder="Select round types" />
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
                  value="Cultural Fit"
                  className="p-2 hover:bg-indigo-50"
                >
                  Cultural Fit
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Round Lengths */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Round Lengths (in minutes):
            </label>
            <Select
              onValueChange={(value) =>
                setRoundLengths((prev) => [...prev, Number(value)])
              }
            >
              <SelectTrigger className="mt-1 w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition-colors duration-200">
                <SelectValue placeholder="Select round lengths" />
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
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
        </form>
      </div>

      {/* Right Side: Results */}
      <div className="w-1/2 bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Generated Questions:</h3>
        {result ? (
          Object.entries(result).map(([round, details]: [string, any]) => (
            <div key={round} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">
                {round} ({details.time} minutes)
              </h4>
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
                    {/* Answer Input */}
                    <textarea
                      value={answers[question.question] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.question, e.target.value)
                      }
                      placeholder="Type your answer here..."
                      rows={3}
                      className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {/* Audio Recording */}
                    <button
                      type="button"
                      onClick={() => handleAudioRecording(question.question)}
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
          ))
        ) : (
          <p className="text-gray-500">No questions generated yet.</p>
        )}
      </div>
    </div>
  );
}
