"use client";

import { useState } from "react";

export default function InterviewScorer() {
  const [questions, setQuestions] = useState<string>("");
  const [answers, setAnswers] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questions || !answers) {
      alert("Please provide both questions and answers.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/interview-scoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to score interview");
      }

      const data = await response.json();
      setResult(data.output); // Use the "output" field from the API response
    } catch (error) {
      console.error(error);
      alert("An error occurred while scoring the interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Interview Scoring</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Questions (JSON):
          </label>
          <textarea
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder='Enter questions as JSON, e.g., ["What is your greatest strength?", "Describe a challenge you faced and how you overcame it."]'
            rows={5}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Answers (JSON):
          </label>
          <textarea
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
            placeholder='Enter answers as JSON, e.g., ["My greatest strength is my ability to communicate effectively.", "I once faced a tight deadline and managed it by prioritizing tasks and working extra hours."]'
            rows={5}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? "Scoring..." : "Score Interview"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Scoring Result:</h3>
          <div className="prose prose-sm max-w-none">
            {result.split("\n").map((line: string, index: number) => (
              <p key={index} className="text-gray-700">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
