'use client';

import { useState } from 'react';

export default function QuestionGenerator() {
  const [resume, setResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume || !jobDescription) {
      alert('Please provide both resume and job description.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          job: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setResult(JSON.parse(data.output)); // Parse the output JSON string
    } catch (error) {
      console.error(error);
      alert('An error occurred while generating questions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Interview Question Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resume (Text):
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume here..."
            rows={5}
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Generated Questions:</h3>
          {Object.entries(result).map(([round, details]: [string, any]) => (
            <div key={round} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">
                {round} ({details.time} minutes)
              </h4>
              <div className="space-y-4">
                {details.questions.map((question: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-700 font-medium">{question.question}</p>
                    <p
                      className={`text-sm font-semibold ${
                        question.difficulty === 'easy'
                          ? 'text-green-600'
                          : question.difficulty === 'medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      Difficulty: {question.difficulty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}