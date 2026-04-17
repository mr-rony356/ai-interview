/**
 * Mock API service layer.
 *
 * Mirrors the shape of the real backend endpoints but returns
 * simulated AI output. Consumers can call these functions directly
 * OR the Next.js API routes can delegate to them — either way, no
 * network, no external dependency.
 *
 * Function names intentionally mirror the real endpoints so that
 * swapping DEMO_MODE off later is a one-line change per call-site.
 */

import {
  aggregateEvaluations,
  createRng,
  delay,
  detectRole,
  generateFakeCandidateList,
  generateQuestionsForRound,
  intBetween,
  scoreAnswer,
  type InterviewQuestion,
  type OverallEvaluation,
  type FakeCandidate,
  type Role,
} from "./mockEngine";
import { SIMULATED_LATENCY } from "./demoConfig";

/* ---------- generate-questions ---------- */

export interface GenerateQuestionsRequest {
  resume?: string;
  job?: string;
  roundTypes?: string[];
  roundLengths?: string[];
  type?: string;
}

export interface GeneratedRound {
  time: number;
  questions: InterviewQuestion[];
}

/** Keyed by round label, e.g. "Round 1 (Technical)". */
export type GeneratedRounds = Record<string, GeneratedRound>;

export async function generateQuestions(
  req: GenerateQuestionsRequest
): Promise<{ output: string }> {
  const { min, max } = SIMULATED_LATENCY.questionGen;
  await delay(intBetween(() => Math.random(), min, max));

  const role: Role = detectRole(req.job ?? "");
  const rng = createRng();

  const roundTypes = req.roundTypes ?? ["Technical"];
  const roundLengths = req.roundLengths ?? ["45"];

  const rounds: GeneratedRounds = {};
  roundTypes.forEach((type, idx) => {
    const length = parseInt(roundLengths[idx] ?? "45", 10);
    const count = length >= 60 ? 5 : length >= 45 ? 4 : 3;
    const label = `Round ${idx + 1} (${type})`;
    rounds[label] = {
      time: length,
      questions: generateQuestionsForRound(role, type, count, rng),
    };
  });

  // Existing UI does `JSON.parse(data.output)`, so preserve that contract.
  return { output: JSON.stringify(rounds) };
}

/* ---------- interview-scoring ---------- */

export interface ScoreInterviewRequest {
  questions: GeneratedRounds;
  answers: Record<string, string>;
  roundTypes?: string[];
  roundLengths?: string[];
}

export interface ScoreInterviewResponse {
  output: string;   // markdown, for the existing UI
  evaluation: OverallEvaluation;
}

export async function scoreInterview(
  req: ScoreInterviewRequest
): Promise<ScoreInterviewResponse> {
  const { min, max } = SIMULATED_LATENCY.scoring;
  await delay(intBetween(() => Math.random(), min, max));

  const rng = createRng();
  const flatQuestions: InterviewQuestion[] = [];
  Object.values(req.questions ?? {}).forEach((round) => {
    (round?.questions ?? []).forEach((q) => flatQuestions.push(q));
  });

  const evals = flatQuestions.map((q) =>
    scoreAnswer(q.question, req.answers?.[q.question] ?? "", q.difficulty, rng)
  );
  const overall = aggregateEvaluations(evals, rng);

  return { output: renderMarkdown(overall), evaluation: overall };
}

function renderMarkdown(o: OverallEvaluation): string {
  const lines: string[] = [];
  lines.push(`## Interview Evaluation`);
  lines.push("");
  lines.push(`**Final Score:** ${o.finalScore} / 100`);
  lines.push(`**Recommendation:** ${o.recommendation}`);
  lines.push("");
  lines.push(`### Category Breakdown`);
  lines.push("");
  lines.push(`| Category | Score |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Technical Accuracy | ${o.categoryAverages.technicalAccuracy} |`);
  lines.push(`| Problem Solving | ${o.categoryAverages.problemSolving} |`);
  lines.push(`| Communication | ${o.categoryAverages.communication} |`);
  lines.push(`| Confidence | ${o.categoryAverages.confidence} |`);
  lines.push("");
  lines.push(`### Summary`);
  lines.push("");
  lines.push(o.summary);
  lines.push("");
  lines.push(`### Per-Question Breakdown`);
  lines.push("");
  o.answerEvaluations.forEach((e, i) => {
    lines.push(`**Q${i + 1}.** ${e.question}`);
    lines.push("");
    lines.push(`- Score: **${e.score}**`);
    lines.push(`- Reasoning: ${e.reasoning}`);
    lines.push("");
  });
  return lines.join("\n");
}

/* ---------- candidates (interviewer dashboard) ---------- */

let CANDIDATE_CACHE: FakeCandidate[] | null = null;

export async function listCandidates(): Promise<FakeCandidate[]> {
  await delay(intBetween(() => Math.random(), 250, 650));
  if (!CANDIDATE_CACHE) CANDIDATE_CACHE = generateFakeCandidateList(8);
  return CANDIDATE_CACHE;
}

export async function getCandidate(id: string): Promise<FakeCandidate | null> {
  const list = await listCandidates();
  return list.find((c) => c.id === id) ?? null;
}

/* ---------- PDF report + email delivery (mocked) ---------- */

export interface ReportPayload {
  candidateName: string;
  candidateEmail: string;
  role: string;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  evaluation: OverallEvaluation;
  generatedAt: string;
}

export async function generateReport(payload: ReportPayload): Promise<{
  fileName: string;
  blobUrl?: string;
  html: string;
}> {
  const { min, max } = SIMULATED_LATENCY.pdfReport;
  await delay(intBetween(() => Math.random(), min, max));

  const html = reportHtml(payload);
  const fileName = `interview-report-${payload.candidateName.replace(/\s+/g, "-").toLowerCase()}.html`;

  // In a browser, turn the HTML into a downloadable blob.
  let blobUrl: string | undefined;
  if (typeof window !== "undefined") {
    const blob = new Blob([html], { type: "text/html" });
    blobUrl = URL.createObjectURL(blob);
  }
  return { fileName, blobUrl, html };
}

export async function sendReportEmail(payload: ReportPayload): Promise<{
  success: true;
  message: string;
}> {
  const { min, max } = SIMULATED_LATENCY.emailDelivery;
  await delay(intBetween(() => Math.random(), min, max));
  return {
    success: true,
    message: `Your detailed report has been sent to ${payload.candidateEmail}.`,
  };
}

function reportHtml(p: ReportPayload): string {
  const rec = p.evaluation.recommendation;
  const recColor =
    rec === "Strong Hire"
      ? "#0ea5e9"
      : rec === "Hire"
      ? "#10b981"
      : rec === "Consider"
      ? "#f59e0b"
      : "#ef4444";

  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<title>Interview Report — ${escapeHtml(p.candidateName)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; max-width: 780px; margin: 40px auto; padding: 0 24px; }
  h1 { margin-bottom: 4px; }
  .muted { color: #64748b; }
  .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; color: white; font-weight: 600; background: ${recColor}; }
  .score-circle { font-size: 56px; font-weight: 700; color: ${recColor}; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e2e8f0; }
  .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-top: 14px; }
  .q { font-weight: 600; }
  .a { color: #334155; margin-top: 4px; }
  .reason { background: #f8fafc; border-left: 3px solid ${recColor}; padding: 10px 12px; margin-top: 8px; border-radius: 4px; }
  footer { margin-top: 40px; color: #94a3b8; font-size: 12px; text-align: center; }
</style></head>
<body>
  <h1>Interview Evaluation Report</h1>
  <p class="muted">Generated ${escapeHtml(new Date(p.generatedAt).toLocaleString())}</p>

  <div class="card">
    <strong>${escapeHtml(p.candidateName)}</strong> &middot; <span class="muted">${escapeHtml(p.candidateEmail)}</span><br/>
    <span class="muted">Role: ${escapeHtml(p.role)}</span>
  </div>

  <div class="card" style="text-align:center;">
    <div class="score-circle">${p.evaluation.finalScore}</div>
    <div class="muted">Final Score</div>
    <div style="margin-top:12px;"><span class="badge">${escapeHtml(rec)}</span></div>
  </div>

  <h2>Category Breakdown</h2>
  <table>
    <thead><tr><th>Category</th><th>Score</th></tr></thead>
    <tbody>
      <tr><td>Technical Accuracy</td><td>${p.evaluation.categoryAverages.technicalAccuracy}</td></tr>
      <tr><td>Problem Solving</td><td>${p.evaluation.categoryAverages.problemSolving}</td></tr>
      <tr><td>Communication</td><td>${p.evaluation.categoryAverages.communication}</td></tr>
      <tr><td>Confidence</td><td>${p.evaluation.categoryAverages.confidence}</td></tr>
    </tbody>
  </table>

  <h2>AI Summary</h2>
  <p>${escapeHtml(p.evaluation.summary)}</p>

  <h2>Per-Question Analysis</h2>
  ${p.evaluation.answerEvaluations.map((e, i) => `
    <div class="card">
      <div class="q">Q${i + 1}. ${escapeHtml(e.question)}</div>
      <div class="a">${escapeHtml(e.answer || "(no answer provided)")}</div>
      <div>Score: <strong>${e.score}</strong></div>
      <div class="reason">${escapeHtml(e.reasoning)}</div>
    </div>
  `).join("")}

  <footer>This report was generated by the HR Interview Platform.</footer>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
