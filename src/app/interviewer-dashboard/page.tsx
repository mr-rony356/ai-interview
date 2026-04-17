"use client";

/**
 * Interviewer Dashboard.
 *
 * Lists candidate profiles (score, role, status) and lets the
 * interviewer drill into a full evaluation with a downloadable
 * report.
 */

import { useEffect, useMemo, useState } from "react";
import type { FakeCandidate } from "@/lib/mockEngine";

type Status = "All" | "Hire" | "Review" | "Reject";

export default function InterviewerDashboardPage() {
  const [candidates, setCandidates] = useState<FakeCandidate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>("All");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Hit the candidates API (which delegates to the mock engine
        // in DEMO_MODE) — but we also want the full evaluation, which
        // isn't on that endpoint. Call the mock engine directly here
        // via a dynamic import so we get the richer data shape.
        const mod = await import("@/lib/mockApi");
        const list = await mod.listCandidates();
        setCandidates(list);
        if (list.length) setSelectedId(list[0].id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!candidates) return [];
    return candidates.filter((c) => {
      if (filter !== "All" && c.status !== filter) return false;
      if (search && !`${c.name} ${c.role} ${c.email}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [candidates, filter, search]);

  const selected = candidates?.find((c) => c.id === selectedId) ?? null;

  const stats = useMemo(() => {
    if (!candidates) return { total: 0, hire: 0, review: 0, reject: 0, avg: 0 };
    return {
      total: candidates.length,
      hire: candidates.filter((c) => c.status === "Hire").length,
      review: candidates.filter((c) => c.status === "Review").length,
      reject: candidates.filter((c) => c.status === "Reject").length,
      avg: Math.round(
        candidates.reduce((s, c) => s + c.evaluation.finalScore, 0) / Math.max(1, candidates.length)
      ),
    };
  }, [candidates]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Interviewer Dashboard</h1>
          <p className="text-slate-500">Review AI-scored candidates and download structured reports.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Candidates" value={stats.total} tone="slate" />
          <StatCard label="Strong Hire / Hire" value={stats.hire} tone="emerald" />
          <StatCard label="Review" value={stats.review} tone="amber" />
          <StatCard label="Reject" value={stats.reject} tone="rose" />
          <StatCard label="Avg Score" value={stats.avg} tone="indigo" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ---- Candidate list ---- */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
            <div className="flex gap-2 mb-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="flex-1 p-2 border border-slate-300 rounded-md text-sm"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Status)}
                className="p-2 border border-slate-300 rounded-md text-sm"
              >
                <option value="All">All</option>
                <option value="Hire">Hire</option>
                <option value="Review">Review</option>
                <option value="Reject">Reject</option>
              </select>
            </div>

            {loading ? (
              <LoadingRows />
            ) : (
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        selectedId === c.id
                          ? "bg-indigo-50 border-indigo-300"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-slate-900">
                            {c.evaluation.finalScore}
                          </p>
                          <StatusPill status={c.status} />
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
                {!filtered.length && (
                  <li className="text-center text-sm text-slate-400 py-8">
                    No candidates match this filter.
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* ---- Detail panel ---- */}
          <div className="lg:col-span-2">
            {selected ? (
              <CandidateDetail candidate={selected} />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center text-slate-400">
                Select a candidate to view their evaluation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "emerald" | "amber" | "rose" | "indigo";
}) {
  const toneMap = {
    slate: "text-slate-700",
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
    indigo: "text-indigo-700",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${toneMap[tone]}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: FakeCandidate["status"] }) {
  const map: Record<FakeCandidate["status"], string> = {
    Hire: "bg-emerald-100 text-emerald-700",
    Review: "bg-amber-100 text-amber-700",
    Reject: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function CandidateDetail({ candidate }: { candidate: FakeCandidate }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadReady, setDownloadReady] = useState<string | null>(null);

  const e = candidate.evaluation;
  const recColor =
    e.recommendation === "Strong Hire"
      ? "text-sky-600 bg-sky-100"
      : e.recommendation === "Hire"
      ? "text-emerald-600 bg-emerald-100"
      : e.recommendation === "Consider"
      ? "text-amber-600 bg-amber-100"
      : "text-rose-600 bg-rose-100";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const payload = {
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        role: candidate.role,
        questions: candidate.questions,
        answers: {}, // mock answers not stored
        evaluation: e,
        generatedAt: new Date().toISOString(),
      };
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.fileName;
      a.click();
      setDownloadReady(data.fileName);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{candidate.name}</h2>
          <p className="text-slate-500">{candidate.email}</p>
          <p className="text-sm text-slate-600 mt-1">
            {candidate.role} · Applied{" "}
            {new Date(candidate.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-indigo-700">{e.finalScore}</p>
          <span className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold ${recColor}`}>
            {e.recommendation}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold mb-3 text-slate-700">Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Technical", e.categoryAverages.technicalAccuracy],
            ["Problem Solving", e.categoryAverages.problemSolving],
            ["Communication", e.categoryAverages.communication],
            ["Confidence", e.categoryAverages.confidence],
          ].map(([label, val]) => (
            <div key={label as string} className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500">{label as string}</p>
              <p className="text-2xl font-bold text-slate-800">{val as number}</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-500"
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-semibold mb-2 text-slate-700">AI Summary</h3>
        <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-indigo-400">
          <p className="text-sm leading-relaxed text-slate-700">{e.summary}</p>
        </div>
      </div>

      {/* Per-question */}
      <div className="p-6">
        <h3 className="font-semibold mb-3 text-slate-700">Per-Question Analysis</h3>
        <div className="space-y-3">
          {e.answerEvaluations.map((a, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-4">
              <div className="flex justify-between items-start gap-4">
                <p className="font-medium text-slate-800 flex-1">
                  Q{i + 1}. {a.question}
                </p>
                <span className="text-lg font-bold text-indigo-700">{a.score}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2 italic">{a.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 flex gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-60"
        >
          {downloading ? "Generating report…" : "📄 Download Report"}
        </button>
        {downloadReady && (
          <span className="text-sm text-emerald-600 self-center">
            ✅ {downloadReady} downloaded
          </span>
        )}
      </div>
    </div>
  );
}
