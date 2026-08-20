/**
 * Guided-journaling prompts.
 *
 * The artboards specify a guided mode but never enumerate the prompts, so this
 * set is written to match the product's stated purpose — breaking negative
 * cycles — rather than generic gratitude filler. Each one asks for a concrete
 * observation instead of a verdict on the self.
 */
export const GUIDED_PROMPTS: readonly string[] = [
  'What thought has repeated itself most today?',
  'Describe one moment today without judging it.',
  'What did you expect to happen, and what actually happened?',
  'Where did you feel that in your body?',
  'What would you say to a friend in this exact situation?',
  'Which of your intentions did today move you toward?',
  'What is one thing you are willing to leave unfinished tonight?',
  'Name the feeling before you explain it.',
] as const;

/** Deterministic per-day pick, so the prompt is stable if the screen remounts. */
export function promptForDay(date = new Date()): string {
  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  return GUIDED_PROMPTS[dayNumber % GUIDED_PROMPTS.length];
}
