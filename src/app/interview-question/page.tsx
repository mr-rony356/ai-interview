"use client";

/**
 * Interview Question page.
 *
 * All backend calls hit the in-app Next.js routes which delegate to
 * the local mock engine. The page adds:
 *   - "AI is thinking" loading states with rotating status text
 *   - A gated results view (score blurred until lead form submitted)
 *   - A lead capture form (name + email) that unlocks the full breakdown
 *   - A report generation + email delivery flow
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { GeneratedRounds } from "@/lib/mockApi";
import type { OverallEvaluation, InterviewQuestion } from "@/lib/mockEngine";

const THINKING_MESSAGES = [
  "Analyzing response…",
  "Evaluating technical depth…",
  "Scoring problem-solving signals…",
  "Weighing communication clarity…",
  "Cross-referencing role expectations…",
  "Finalizing AI recommendation…",
];

export default function InterviewQuestionPage() {
  // ---- form state ----
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [rounds, setRounds] = useState<{ type: string; length: string }[]>([
    { type: "Technical", length: "45" },
  ]);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  // ---- interview state ----
  const [generatedRounds, setGeneratedRounds] = useState<GeneratedRounds | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // ---- evaluation state ----
  const [evaluation, setEvaluation] = useState<OverallEvaluation | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [unlocked, setUnlocked] = useState(false);

  // ---- lead capture ----
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  // ---- UX state ----
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState(THINKING_MESSAGES[0]);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scoring || loading) {
      let i = 0;
      setThinkingMsg(THINKING_MESSAGES[0]);
      thinkingTimerRef.current = setInterval(() => {
        i = (i + 1) % THINKING_MESSAGES.length;
        setThinkingMsg(THINKING_MESSAGES[i]);
      }, 700);
    } else if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    return () => {
      if (thinkingTimerRef.current) clearInterval(thinkingTimerRef.current);
    };
  }, [scoring, loading]);

  const flatQuestions: InterviewQuestion[] = useMemo(() => {
    if (!generatedRounds) return [];
    return Object.values(generatedRounds).flatMap((r) => r.questions);
  }, [generatedRounds]);

  // ----------------------------------------------------------------
  //  Handlers
  // ----------------------------------------------------------------

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("/api/extract-text", { method: "POST", body: formData });
      if (!res.ok) throw new Error("extract failed");
      const data = await res.json();
      const text = (data.pages ?? [])
        .flatMap((p: any) => p.lines)
        .map((l: any) => l.content)
        .join(" ");
      setResumeText(text);
    } catch {
      // Graceful fallback if OCR is unavailable.
      setResumeText("Candidate resume");
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || rounds.length === 0) {
      alert("Please provide a job description and at least one round.");
      return;
    }
    setLoading(true);
    setEvaluation(null);
    setMarkdown("");
    setUnlocked(false);

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: resumeText || "Candidate resume",
          job: jobDescription,
          roundTypes: rounds.map((r) => r.type),
          roundLengths: rounds.map((r) => r.length),
          type: "questions",
        }),
      });
      const data = await res.json();
      const parsed: GeneratedRounds = JSON.parse(data.output);
      setGeneratedRounds(parsed);
      setExpandedRound(Object.keys(parsed)[0] ?? null);
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswers = async () => {
    if (!generatedRounds) return;
    setScoring(true);
    try {
      const res = await fetch("/api/interview-scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: generatedRounds,
          answers,
          roundTypes: rounds.map((r) => r.type),
          roundLengths: rounds.map((r) => r.length),
        }),
      });
      const data = await res.json();
      setEvaluation(data.evaluation);
      setMarkdown(data.output);
    } catch (err) {
      console.error(err);
      alert("Scoring failed.");
    } finally {
      setScoring(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !/^\S+@\S+\.\S+$/.test(leadEmail)) {
      alert("Please enter your full name and a valid email.");
      return;
    }
    setUnlocked(true);

    // Fire-and-forget the mock report + email delivery.
    try {
      const payload = {
        candidateName: leadName,
        candidateEmail: leadEmail,
        role: jobDescription.slice(0, 60),
        questions: flatQuestions,
        answers,
        evaluation: evaluation!,
        generatedAt: new Date().toISOString(),
      };
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setEmailStatus(data.emailStatus ?? null);

      // Client-side download blob.
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName || "interview-report.html";
      // Don't auto-click — just expose a link below.
      (window as any).__lastReportUrl = url;
      (window as any).__lastReportFile = a.download;
    } catch (err) {
      console.error(err);
    }
  };

  const addRound = () =>
    setRounds((prev) => [...prev, { type: "Technical", length: "45" }]);
  const removeRound = (i: number) =>
    setRounds((prev) => prev.filter((_, idx) => idx !== i));

  // ----------------------------------------------------------------
  //  Render
  // ----------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* ---- Setup panel ---- */}
        <div className="lg:w-2/5 bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-700">
              AI Powered
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Interview Question Generator</h2>
          <p className="text-slate-500 text-sm mb-6">
            Upload a resume, describe the role, and our AI will generate a tailored
            interview in seconds.
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Upload Resume (PDF or image)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="mt-1 block w-full p-2 border border-slate-300 rounded-lg text-sm"
              />
              {file && <p className="text-xs text-slate-500 mt-1">Loaded: {file.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. Senior Frontend Developer — React, TypeScript, design systems..."
                rows={5}
                className="mt-1 block w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Rounds</label>
              {rounds.map((r, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={r.type}
                    onValueChange={(v) =>
                      setRounds((prev) =>
                        prev.map((x, i) => (i === index ? { ...x, type: v } : x))
                      )
                    }
                  >
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue placeholder="Round type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Behavioral">Behavioral</SelectItem>
                      <SelectItem value="HR/Phone Screen">HR / Phone Screen</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={r.length}
                    onValueChange={(v) =>
                      setRounds((prev) =>
                        prev.map((x, i) => (i === index ? { ...x, length: v } : x))
                      )
                    }
                  >
                    <SelectTrigger className="w-24 text-sm">
                      <SelectValue placeholder="min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30m</SelectItem>
                      <SelectItem value="45">45m</SelectItem>
                      <SelectItem value="60">60m</SelectItem>
                    </SelectContent>
                  </Select>
                  {rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(index)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRound}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add round
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner /> {thinkingMsg}
                </>
              ) : (
                "Generate Interview"
              )}
            </button>
          </form>
        </div>

        {/* ---- Interview panel ---- */}
        <div className="lg:w-3/5 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Generated Questions</h3>
              {generatedRounds && (
                <span className="text-xs text-slate-500">
                  {flatQuestions.length} questions across {Object.keys(generatedRounds).length} round(s)
                </span>
              )}
            </div>

            {!generatedRounds && !loading && (
              <div className="text-slate-400 text-sm flex items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-lg">
                Your AI-generated interview will appear here.
              </div>
            )}
            {loading && <ThinkingBlock message={thinkingMsg} />}

            {generatedRounds && (
              <div className="space-y-3">
                {Object.entries(generatedRounds).map(([name, round]) => (
                  <div key={name} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedRound(expandedRound === name ? null : name)}
                      className="w-full flex justify-between items-center p-4 hover:bg-slate-50"
                    >
                      <span className="font-semibold">
                        {name} <span className="text-slate-400 font-normal">· {round.time} min</span>
                      </span>
                      <span className="text-slate-500 text-sm">
                        {round.questions.length} questions
                      </span>
                    </button>
                    {expandedRound === name && (
                      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
                        {round.questions.map((q, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-white border border-slate-200 rounded-lg"
                          >
                            <p className="font-medium text-slate-800">
                              {idx + 1}. {q.question}
                            </p>
                            <span
                              className={`inline-block text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${
                                q.difficulty === "easy"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : q.difficulty === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                            <textarea
                              value={answers[q.question] ?? ""}
                              onChange={(e) =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [q.question]: e.target.value,
                                }))
                              }
                              placeholder="Type your answer…"
                              rows={3}
                              className="mt-2 block w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleSubmitAnswers}
                  disabled={scoring}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {scoring ? (
                    <>
                      <Spinner /> {thinkingMsg}
                    </>
                  ) : (
                    "Submit Answers for AI Evaluation"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ---- Evaluation panel ---- */}
          {evaluation && (
            <EvaluationCard
              evaluation={evaluation}
              markdown={markdown}
              unlocked={unlocked}
              leadName={leadName}
              leadEmail={leadEmail}
              setLeadName={setLeadName}
              setLeadEmail={setLeadEmail}
              emailStatus={emailStatus}
              onUnlock={handleUnlock}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
  );
}

function ThinkingBlock({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-500">
      <div className="flex gap-1 mb-4">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function EvaluationCard({
  evaluation,
  markdown,
  unlocked,
  leadName,
  leadEmail,
  setLeadName,
  setLeadEmail,
  emailStatus,
  onUnlock,
}: {
  evaluation: OverallEvaluation;
  markdown: string;
  unlocked: boolean;
  leadName: string;
  leadEmail: string;
  setLeadName: (v: string) => void;
  setLeadEmail: (v: string) => void;
  emailStatus: string | null;
  onUnlock: (e: React.FormEvent) => void;
}) {
  const recColor =
    evaluation.recommendation === "Strong Hire"
      ? "text-sky-600 bg-sky-100"
      : evaluation.recommendation === "Hire"
      ? "text-emerald-600 bg-emerald-100"
      : evaluation.recommendation === "Consider"
      ? "text-amber-600 bg-amber-100"
      : "text-rose-600 bg-rose-100";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
      <h3 className="text-xl font-semibold mb-4">AI Evaluation</h3>

      {/* Top banner */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-br from-indigo-50 to-sky-50 rounded-xl">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Final Score</p>
          <p
            className={`text-5xl font-bold ${unlocked ? "text-indigo-700" : "blur-md select-none"}`}
          >
            {evaluation.finalScore}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 text-right">
            Recommendation
          </p>
          <span
            className={`mt-1 inline-block px-3 py-1 rounded-full font-semibold text-sm ${recColor} ${
              unlocked ? "" : "blur-sm"
            }`}
          >
            {evaluation.recommendation}
          </span>
        </div>
      </div>

      {/* Gated content */}
      {!unlocked ? (
        <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 bg-indigo-50/30">
          <h4 className="font-semibold text-slate-800 mb-1">
            🔒 Unlock your full AI report
          </h4>
          <p className="text-sm text-slate-600 mb-4">
            Enter your name and email to view per-question reasoning, the full category
            breakdown, and receive a PDF copy by email.
          </p>
          <form onSubmit={onUnlock} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Full name"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="p-2 border border-slate-300 rounded-md text-sm"
            />
            <input
              type="email"
              required
              placeholder="you@outlook.com"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              className="p-2 border border-slate-300 rounded-md text-sm"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
            >
              Unlock Full Report
            </button>
          </form>
        </div>
      ) : (
        <>
          {emailStatus && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-md border border-emerald-200 flex items-center gap-2">
              <span>✅</span> {emailStatus}
            </div>
          )}

          <CategoryBars averages={evaluation.categoryAverages} />

          <div className="mt-4 p-4 bg-slate-50 rounded-lg border-l-4 border-indigo-400">
            <p className="text-sm text-slate-700 leading-relaxed">{evaluation.summary}</p>
          </div>

          <div className="prose prose-sm max-w-none mt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                const url = (window as any).__lastReportUrl;
                const file = (window as any).__lastReportFile;
                if (!url) return alert("Report not ready");
                const a = document.createElement("a");
                a.href = url;
                a.download = file;
                a.click();
              }}
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-md"
            >
              📄 Download Report
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold py-2 rounded-md"
            >
              🖨 Print / Save as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CategoryBars({
  averages,
}: {
  averages: { communication: number; technicalAccuracy: number; problemSolving: number; confidence: number };
}) {
  const rows: [string, number][] = [
    ["Technical Accuracy", averages.technicalAccuracy],
    ["Problem Solving", averages.problemSolving],
    ["Communication", averages.communication],
    ["Confidence", averages.confidence],
  ];
  return (
    <div className="space-y-3">
      {rows.map(([label, val]) => (
        <div key={label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">{label}</span>
            <span className="font-semibold text-slate-800">{val}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all"
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
