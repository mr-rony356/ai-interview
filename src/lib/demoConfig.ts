/**
 * Global runtime configuration.
 *
 * When DEMO_MODE is true, the platform runs with simulated AI
 * behavior and mock data — no Supabase, no OpenAI, no backend.
 *
 * To re-enable real APIs later, flip this flag to false and the
 * existing API routes + mock service layer will defer to the real
 * implementations.
 */
export const DEMO_MODE: boolean = true;

/**
 * Simulated latency bounds for "AI is thinking" animations.
 * Values are in milliseconds.
 */
export const SIMULATED_LATENCY = {
  questionGen: { min: 800, max: 1800 },
  scoring: { min: 1200, max: 2400 },
  pdfReport: { min: 900, max: 1500 },
  emailDelivery: { min: 600, max: 1100 },
} as const;

/**
 * Controls how gated results are revealed. Initially the final score
 * is blurred; after the lead form is submitted (name + email), the
 * full breakdown is unlocked.
 */
export const LEAD_GATING_ENABLED: boolean = true;
