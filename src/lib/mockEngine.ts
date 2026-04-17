/**
 * Mock AI engine for the interview platform.
 *
 * Provides:
 *  - Seeded pseudo-random utilities (reproducible-yet-varied output)
 *  - Realistic interview-question banks per role / round type
 *  - Weighted scoring with category breakdown
 *  - Natural-sounding AI reasoning strings that track the score
 *  - Fake candidate profile generator
 */

/* ------------------------------------------------------------------ */
/*  Seeded RNG (mulberry32)                                            */
/* ------------------------------------------------------------------ */

export function createRng(seed?: number) {
  let s = (seed ?? Math.floor(Math.random() * 2 ** 31)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export const pick = <T,>(rng: Rng, arr: T[]): T => arr[Math.floor(rng() * arr.length)];
export const intBetween = (rng: Rng, lo: number, hi: number): number =>
  Math.floor(rng() * (hi - lo + 1)) + lo;
export const floatBetween = (rng: Rng, lo: number, hi: number): number =>
  rng() * (hi - lo) + lo;

/** Simulated network latency for an "AI is thinking" feel. */
export const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
export const jitteredDelay = (lo: number, hi: number) =>
  delay(Math.floor(Math.random() * (hi - lo) + lo));

/* ------------------------------------------------------------------ */
/*  Role detection                                                     */
/* ------------------------------------------------------------------ */

export type Role =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full-Stack Engineer"
  | "Data Scientist"
  | "Product Manager"
  | "DevOps Engineer"
  | "Mobile Developer"
  | "General";

export function detectRole(jobDescription: string): Role {
  const jd = (jobDescription || "").toLowerCase();
  if (/\b(product manager|pm\b|roadmap|stakeholder)\b/.test(jd)) return "Product Manager";
  if (/\b(data scientist|ml|machine learning|pandas|pytorch)\b/.test(jd)) return "Data Scientist";
  if (/\b(devops|sre|kubernetes|terraform|ci\/cd)\b/.test(jd)) return "DevOps Engineer";
  if (/\b(mobile|ios|android|swift|kotlin|react native)\b/.test(jd)) return "Mobile Developer";
  if (/\b(frontend|front-end|react|vue|angular|css|ui)\b/.test(jd)) return "Frontend Developer";
  if (/\b(backend|back-end|api|node|django|spring|postgres)\b/.test(jd)) return "Backend Developer";
  if (/\b(full[- ]?stack|fullstack)\b/.test(jd)) return "Full-Stack Engineer";
  return "General";
}

/* ------------------------------------------------------------------ */
/*  Question banks                                                     */
/* ------------------------------------------------------------------ */

type Difficulty = "easy" | "medium" | "hard";
export interface InterviewQuestion {
  question: string;
  difficulty: Difficulty;
}

const TECHNICAL_BY_ROLE: Record<Role, InterviewQuestion[]> = {
  "Frontend Developer": [
    { question: "Explain the virtual DOM and how React reconciles changes.", difficulty: "medium" },
    { question: "How would you optimize a React app suffering from re-render storms?", difficulty: "hard" },
    { question: "What are CSS specificity rules, and when would you reach for !important?", difficulty: "easy" },
    { question: "Describe the difference between controlled and uncontrolled components.", difficulty: "medium" },
    { question: "How do you handle accessibility (a11y) in a complex form?", difficulty: "medium" },
    { question: "Explain how you'd architect state for a large SPA — Redux vs React Query vs Zustand.", difficulty: "hard" },
  ],
  "Backend Developer": [
    { question: "How would you design a rate limiter for a public API?", difficulty: "hard" },
    { question: "Walk me through database indexing strategies and their trade-offs.", difficulty: "medium" },
    { question: "What's the difference between REST and gRPC, and when would you pick each?", difficulty: "medium" },
    { question: "Explain how you'd handle idempotency for a payments endpoint.", difficulty: "hard" },
    { question: "Describe your approach to structured logging and observability.", difficulty: "easy" },
  ],
  "Full-Stack Engineer": [
    { question: "Walk me through how you'd ship a new feature end-to-end — DB to UI.", difficulty: "medium" },
    { question: "How do you decide what logic lives on the client vs the server?", difficulty: "medium" },
    { question: "Describe a real bug you debugged that crossed stack boundaries.", difficulty: "hard" },
    { question: "How do you handle authentication across an SSR app?", difficulty: "hard" },
    { question: "Explain optimistic updates and their pitfalls.", difficulty: "medium" },
  ],
  "Data Scientist": [
    { question: "How do you detect and handle data leakage in a training pipeline?", difficulty: "hard" },
    { question: "Explain bias/variance trade-off with a concrete example.", difficulty: "medium" },
    { question: "Walk me through how you'd A/B test a recommendation model.", difficulty: "hard" },
    { question: "How do you choose between tree-based methods and neural networks?", difficulty: "medium" },
    { question: "Describe your approach to feature engineering on messy real-world data.", difficulty: "easy" },
  ],
  "Product Manager": [
    { question: "Tell me about a time you killed a feature — how did you decide, and how did you communicate it?", difficulty: "medium" },
    { question: "How do you prioritize between engineering debt and new customer-facing work?", difficulty: "hard" },
    { question: "Walk me through how you'd launch a product in a brand-new market segment.", difficulty: "hard" },
    { question: "What's your framework for writing a PRD?", difficulty: "easy" },
    { question: "Describe a metric you owned and what you did when it stalled.", difficulty: "medium" },
  ],
  "DevOps Engineer": [
    { question: "How would you design a zero-downtime deployment pipeline?", difficulty: "hard" },
    { question: "Explain blue/green vs canary deployments.", difficulty: "medium" },
    { question: "How do you approach secrets management at scale?", difficulty: "medium" },
    { question: "What's your incident-response playbook for a prod outage?", difficulty: "hard" },
    { question: "Describe your Terraform module design for a multi-region service.", difficulty: "medium" },
  ],
  "Mobile Developer": [
    { question: "How do you handle offline-first sync on a mobile client?", difficulty: "hard" },
    { question: "Walk me through your approach to mobile performance profiling.", difficulty: "medium" },
    { question: "What's your strategy for shared code between iOS and Android?", difficulty: "medium" },
    { question: "How do you manage app size and cold-start time?", difficulty: "medium" },
    { question: "Describe how you handle push notifications reliably.", difficulty: "easy" },
  ],
  General: [
    { question: "Tell me about a technically ambiguous problem you solved recently.", difficulty: "medium" },
    { question: "Walk me through a system you're most proud of building.", difficulty: "medium" },
    { question: "Describe a time you disagreed with a senior engineer — what happened?", difficulty: "medium" },
    { question: "How do you decide when code is 'good enough' to ship?", difficulty: "easy" },
    { question: "What's the hardest bug you've chased in the last year?", difficulty: "hard" },
  ],
};

const BEHAVIORAL_QUESTIONS: InterviewQuestion[] = [
  { question: "Tell me about a time you had to give difficult feedback to a teammate.", difficulty: "medium" },
  { question: "Describe a project that failed — what did you learn?", difficulty: "medium" },
  { question: "Walk me through a conflict with a product or design partner.", difficulty: "medium" },
  { question: "When have you pushed back on a deadline? How did that go?", difficulty: "medium" },
  { question: "Tell me about a time you mentored someone.", difficulty: "easy" },
];

const HR_QUESTIONS: InterviewQuestion[] = [
  { question: "Walk me through your career so far.", difficulty: "easy" },
  { question: "Why are you interested in this role specifically?", difficulty: "easy" },
  { question: "What are you looking for in your next team?", difficulty: "easy" },
  { question: "What are your compensation expectations?", difficulty: "easy" },
  { question: "When would you be able to start?", difficulty: "easy" },
];

export function generateQuestionsForRound(
  role: Role,
  roundType: string,
  count: number,
  rng: Rng
): InterviewQuestion[] {
  let bank: InterviewQuestion[];
  if (roundType === "Behavioral") bank = BEHAVIORAL_QUESTIONS;
  else if (roundType === "HR/Phone Screen") bank = HR_QUESTIONS;
  else bank = TECHNICAL_BY_ROLE[role] ?? TECHNICAL_BY_ROLE.General;

  // Shuffle copy and slice.
  const copy = [...bank];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

/* ------------------------------------------------------------------ */
/*  Scoring engine                                                     */
/* ------------------------------------------------------------------ */

export interface CategoryScores {
  communication: number;
  technicalAccuracy: number;
  problemSolving: number;
  confidence: number;
}

export interface AnswerEvaluation {
  question: string;
  answer: string;
  score: number;
  categories: CategoryScores;
  reasoning: string;
}

export interface OverallEvaluation {
  finalScore: number;
  recommendation: "Strong Hire" | "Hire" | "Consider" | "No Hire";
  summary: string;
  answerEvaluations: AnswerEvaluation[];
  categoryAverages: CategoryScores;
}

const WEIGHTS = {
  technicalAccuracy: 0.4,
  problemSolving: 0.3,
  communication: 0.2,
  confidence: 0.1,
} as const;

/**
 * Score one answer. The candidate's actual text is "lightly incorporated"
 * by nudging the score band based on its length and presence of technical
 * keywords — enough to feel responsive without being a real grader.
 */
export function scoreAnswer(
  question: string,
  answer: string,
  difficulty: Difficulty,
  rng: Rng
): AnswerEvaluation {
  const len = (answer || "").trim().length;
  const hasSignal =
    /\b(because|for example|trade[- ]?off|scale|latency|edge case|optimiz|test|metric|framework)\b/i.test(
      answer || ""
    );

  // Base band by difficulty; nudge up for longer/more-detailed answers.
  const baseLo = difficulty === "easy" ? 72 : difficulty === "medium" ? 66 : 60;
  const baseHi = difficulty === "easy" ? 93 : difficulty === "medium" ? 92 : 90;
  let base = intBetween(rng, baseLo, baseHi);
  if (len > 220) base = Math.min(95, base + intBetween(rng, 2, 5));
  if (hasSignal) base = Math.min(95, base + intBetween(rng, 1, 4));
  if (len < 30 && len > 0) base = Math.max(55, base - intBetween(rng, 3, 8));

  // Spread categories around the base by +/- 6 with some correlation.
  const communication = clamp(base + intBetween(rng, -5, 6));
  const technicalAccuracy = clamp(base + intBetween(rng, -6, 5));
  const problemSolving = clamp(base + intBetween(rng, -5, 6));
  const confidence = clamp(base + intBetween(rng, -4, 7));

  const categories: CategoryScores = {
    communication,
    technicalAccuracy,
    problemSolving,
    confidence,
  };

  const weighted = Math.round(
    technicalAccuracy * WEIGHTS.technicalAccuracy +
      problemSolving * WEIGHTS.problemSolving +
      communication * WEIGHTS.communication +
      confidence * WEIGHTS.confidence
  );

  return {
    question,
    answer,
    score: weighted,
    categories,
    reasoning: buildReasoning(weighted, categories, difficulty, rng),
  };
}

function clamp(n: number, lo = 55, hi = 96) {
  return Math.max(lo, Math.min(hi, n));
}

/* ------------------------------------------------------------------ */
/*  AI reasoning generator                                             */
/* ------------------------------------------------------------------ */

const OPENERS_HIGH = [
  "The candidate demonstrates strong command of the subject",
  "A confident, well-structured answer",
  "Clear fluency with the underlying concepts",
  "The response shows depth and intentionality",
];
const OPENERS_MID = [
  "The candidate demonstrates a solid understanding of core concepts",
  "Fundamentals are in place",
  "A reasonable answer overall",
  "Good grasp of the basics",
];
const OPENERS_LOW = [
  "The response stays surface-level",
  "The candidate touches on the right area but does not go deep",
  "The answer hints at the right direction but lacks rigor",
  "There's a gap between recognition of the concept and applied reasoning",
];

const STRENGTHS = [
  "articulates trade-offs clearly",
  "reaches for concrete examples",
  "structures the answer with a clear arc",
  "connects the problem to real system constraints",
  "demonstrates strong communication",
  "shows genuine comfort with the domain",
  "stays precise with terminology",
];

const WEAKNESSES = [
  "lacks depth in edge-case handling",
  "could benefit from more structured articulation",
  "misses optimization considerations",
  "would be stronger with a concrete example",
  "glosses over failure modes",
  "doesn't quite land the trade-off discussion",
  "stops short of connecting to system-level impact",
];

const CLOSERS = [
  "Overall a promising signal for the role.",
  "A credible answer with room to sharpen.",
  "Solid baseline, and coachable on the gaps.",
  "Strong enough to move forward with confidence.",
  "Worth probing further in a follow-up round.",
];

function buildReasoning(
  score: number,
  cats: CategoryScores,
  difficulty: Difficulty,
  rng: Rng
): string {
  const opener =
    score >= 82 ? pick(rng, OPENERS_HIGH) : score >= 70 ? pick(rng, OPENERS_MID) : pick(rng, OPENERS_LOW);
  const strength = pick(rng, STRENGTHS);
  const weakness = pick(rng, WEAKNESSES);
  const closer = score >= 75 ? pick(rng, CLOSERS) : "Would want to see more depth before recommending.";

  // Call out the highest and lowest category for texture.
  const entries = Object.entries(cats) as [keyof CategoryScores, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top = humanizeCategory(entries[0][0]);
  const bottom = humanizeCategory(entries[entries.length - 1][0]);

  const difficultyNote =
    difficulty === "hard"
      ? " Given the difficulty of the question, this is a non-trivial result."
      : difficulty === "easy"
      ? ""
      : "";

  return `${opener}. The candidate ${strength}, but ${weakness}. Strongest in ${top}; weakest in ${bottom}.${difficultyNote} ${closer}`;
}

function humanizeCategory(k: keyof CategoryScores): string {
  switch (k) {
    case "communication":
      return "communication";
    case "technicalAccuracy":
      return "technical accuracy";
    case "problemSolving":
      return "problem solving";
    case "confidence":
      return "confidence";
  }
}

/* ------------------------------------------------------------------ */
/*  Overall aggregation                                                */
/* ------------------------------------------------------------------ */

export function aggregateEvaluations(evals: AnswerEvaluation[], rng: Rng): OverallEvaluation {
  const avg = (k: keyof CategoryScores) =>
    Math.round(evals.reduce((s, e) => s + e.categories[k], 0) / Math.max(1, evals.length));

  const averages: CategoryScores = {
    communication: avg("communication"),
    technicalAccuracy: avg("technicalAccuracy"),
    problemSolving: avg("problemSolving"),
    confidence: avg("confidence"),
  };

  const finalScore = Math.round(
    averages.technicalAccuracy * WEIGHTS.technicalAccuracy +
      averages.problemSolving * WEIGHTS.problemSolving +
      averages.communication * WEIGHTS.communication +
      averages.confidence * WEIGHTS.confidence
  );

  const recommendation: OverallEvaluation["recommendation"] =
    finalScore >= 85 ? "Strong Hire" : finalScore >= 70 ? "Hire" : finalScore >= 55 ? "Consider" : "No Hire";

  return {
    finalScore,
    recommendation,
    summary: buildOverallSummary(finalScore, averages, rng),
    answerEvaluations: evals,
    categoryAverages: averages,
  };
}

function buildOverallSummary(finalScore: number, cats: CategoryScores, rng: Rng): string {
  const entries = Object.entries(cats) as [keyof CategoryScores, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const strongest = humanizeCategory(entries[0][0]);
  const weakest = humanizeCategory(entries[entries.length - 1][0]);

  const intro =
    finalScore >= 85
      ? "Overall, the candidate presents a strong, well-rounded profile"
      : finalScore >= 70
      ? "Overall, the candidate shows promising ability with some refinement opportunities"
      : finalScore >= 55
      ? "The candidate has a workable foundation but meaningful gaps remain"
      : "The candidate does not yet meet the bar for this role";

  const middle =
    finalScore >= 85
      ? `Particularly strong in ${strongest}, with consistent signal across every category.`
      : finalScore >= 70
      ? `They lead with ${strongest} and have room to grow in ${weakest}.`
      : `${capitalize(weakest)} is the main area of concern; ${strongest} is a relative bright spot.`;

  const closers = [
    "Recommend moving forward with a targeted follow-up round.",
    "Clear signal here — recommend progressing in the pipeline.",
    "Worth a deeper technical dive before final decision.",
    "Lean toward advancing; the profile is credible.",
    "Borderline case — team should calibrate together.",
    "Recommend against advancing at this stage.",
  ];
  const closer =
    finalScore >= 85
      ? closers[1]
      : finalScore >= 70
      ? pick(rng, [closers[0], closers[3]])
      : finalScore >= 55
      ? pick(rng, [closers[2], closers[4]])
      : closers[5];

  return `${intro}. ${middle} ${closer}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------------------------------------------ */
/*  Fake candidate generator (for dashboard)                           */
/* ------------------------------------------------------------------ */

const FIRST_NAMES = [
  "Priya", "Marcus", "Sofia", "Jamal", "Ava", "Diego", "Linh", "Noah", "Zara",
  "Ethan", "Maya", "Omar", "Chloe", "Sanjay", "Isabella", "Ben", "Amara",
];
const LAST_NAMES = [
  "Patel", "Chen", "Johnson", "Rodriguez", "Nguyen", "Okonkwo", "Khan",
  "Silva", "Fischer", "Anderson", "Kumar", "Garcia", "Park", "Müller",
];

export interface FakeCandidate {
  id: string;
  name: string;
  email: string;
  role: Role;
  appliedAt: string;
  evaluation: OverallEvaluation;
  status: "Hire" | "Reject" | "Review";
  questions: InterviewQuestion[];
}

const ALL_ROLES: Role[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Engineer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "Mobile Developer",
];

const EMAIL_DOMAINS = ["outlook.com", "gmail.com"];

export function generateFakeCandidate(seed: number): FakeCandidate {
  const rng = createRng(seed);
  const first = pick(rng, FIRST_NAMES);
  const last = pick(rng, LAST_NAMES);
  const role = pick(rng, ALL_ROLES);
  const domain = pick(rng, EMAIL_DOMAINS);
  const questions = generateQuestionsForRound(role, "Technical", intBetween(rng, 3, 5), rng);

  const evals = questions.map((q) =>
    scoreAnswer(q.question, mockAnswerFor(q.question, rng), q.difficulty, rng)
  );
  const overall = aggregateEvaluations(evals, rng);

  const status: FakeCandidate["status"] =
    overall.finalScore >= 82 ? "Hire" : overall.finalScore >= 68 ? "Review" : "Reject";

  const daysAgo = intBetween(rng, 0, 21);
  const applied = new Date();
  applied.setDate(applied.getDate() - daysAgo);

  return {
    id: `c_${seed.toString(36)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}@${domain}`.toLowerCase(),
    role,
    appliedAt: applied.toISOString(),
    evaluation: overall,
    status,
    questions,
  };
}

const MOCK_ANSWER_SNIPPETS = [
  "I'd start by clarifying the requirements and surfacing any hidden constraints, then sketch a minimal solution and iterate.",
  "Typically I reach for a well-understood pattern first — it's easier to refactor toward something novel than the other way around.",
  "The trade-off here is between throughput and latency; in practice I'd lean toward latency unless there's a clear batching story.",
  "I've run into this before — we ended up instrumenting the hot path and found the bottleneck wasn't where we expected.",
  "My default is to write the test first, even for exploratory code — it forces a cleaner interface.",
];

function mockAnswerFor(_question: string, rng: Rng): string {
  return pick(rng, MOCK_ANSWER_SNIPPETS);
}

export function generateFakeCandidateList(n: number): FakeCandidate[] {
  return Array.from({ length: n }, (_, i) => generateFakeCandidate(1000 + i * 37));
}
