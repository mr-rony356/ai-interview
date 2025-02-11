"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function CombinedGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jobDescription) {
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

      // Step 2: Generate job match analysis
      const generateResponse = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: extractedText,
          job: jobDescription,
          type: "job_match",
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate job match analysis");
      }

      const generateData = await generateResponse.json();
      setResult(generateData.output); // Use the output directly
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6 space-x-6">
      {/* Left Side: Form Fields */}
      <div className="w-2/5 bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Job Match Analysis
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Analyzing..." : "Analyze Job Match"}
          </button>
        </form>
      </div>
      {/* Right Side: Results */}

      <div className="w-3/5 bg-white p-6 shadow-lg rounded-lg">
  <h3 className="text-2xl font-bold mb-4">Job Match Analysis:</h3>
  {result ? (
    <div className="prose prose-lg prose-gray max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
    </div>
  ) : (
    <p className="text-gray-500">No analysis generated yet.</p>
  )}
</div>    </div>
  );
}
