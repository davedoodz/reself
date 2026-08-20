import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { usePersistentState } from './persist';

/** Which tab-bar affordance a coach mark points at. */
export type CoachTarget = 'fab' | 'intentions' | 'entries' | 'profile' | 'settings';

export type CoachStep = {
  target: CoachTarget;
  /** Rendered as: "The <icon> <lede>" so the icon sits inline, as drawn. */
  lede: string;
  body: string;
  action: string;
};

/**
 * Copy lifted from artboards m4, m6, m8, m12, m14.
 *
 * The m8 artboard's body text was a copy-paste of the Intentions copy ("...set,
 * edit, and view your behavioural goals...") which does not describe the Journal
 * Entries screen. Corrected here.
 */
export const COACH_STEPS: readonly CoachStep[] = [
  {
    target: 'fab',
    lede: 'button is your Recorder.',
    body: 'This is where you can record your journal entries, either through voice or text, guided or free-form.',
    action: 'Click to open and close.',
  },
  {
    target: 'intentions',
    lede: 'icon is your List of Intentions.',
    body: 'This is where you can set, edit, and view your behavioural goals that orient you towards your ideal way of being.',
    action: 'Click to open.',
  },
  {
    target: 'entries',
    lede: 'icon is your Journal Entries.',
    body: 'This is where every entry you record or write is kept, grouped by day, ready to play back or read again.',
    action: 'Click to open.',
  },
  {
    target: 'profile',
    lede: 'icon is your Profile.',
    body: 'This is where you can find information about your account details.',
    action: 'Click to open.',
  },
  {
    target: 'settings',
    lede: 'icon is your Settings.',
    body: 'This is where you can find more information about the system.',
    action: 'Click to open.',
  },
] as const;

const STORAGE_KEY = 'reself.tutorial.v1';

type TutorialState = {
  /** Index into COACH_STEPS, or -1 once the walkthrough is finished. */
  step: number;
};

type TutorialApi = {
  step: CoachStep | null;
  stepIndex: number;
  stepCount: number;
  hydrated: boolean;
  advance: () => void;
  skip: () => void;
  restart: () => void;
};

const TutorialContext = createContext<TutorialApi | null>(null);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const { value, setValue, hydrated } = usePersistentState<TutorialState>(STORAGE_KEY, { step: 0 });

  const advance = useCallback(
    () =>
      setValue((prev) => ({
        step: prev.step >= 0 && prev.step + 1 < COACH_STEPS.length ? prev.step + 1 : -1,
      })),
    [setValue],
  );
  const skip = useCallback(() => setValue({ step: -1 }), [setValue]);
  const restart = useCallback(() => setValue({ step: 0 }), [setValue]);

  const api = useMemo<TutorialApi>(
    () => ({
      step: value.step >= 0 ? COACH_STEPS[value.step] : null,
      stepIndex: value.step,
      stepCount: COACH_STEPS.length,
      hydrated,
      advance,
      skip,
      restart,
    }),
    [value.step, hydrated, advance, skip, restart],
  );

  return <TutorialContext.Provider value={api}>{children}</TutorialContext.Provider>;
}

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error('useTutorial must be used inside <TutorialProvider>');
  return ctx;
}
