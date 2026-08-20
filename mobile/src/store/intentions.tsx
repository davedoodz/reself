import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { makeId, usePersistentState } from './persist';

export type Intention = {
  id: string;
  title: string;
  detail: string;
  createdAt: number;
};

const STORAGE_KEY = 'reself.intentions.v1';

/**
 * Seeded on first launch so the List of Intentions is not an empty screen for a
 * brand-new user. These are examples of behavioural goals, editable and
 * deletable like any other.
 */
const SEED: Intention[] = [
  {
    id: 'seed-presence',
    title: 'Stay present in conversations',
    detail: 'Put the phone face down when someone is talking to me. Ask one more question before I answer.',
    createdAt: 0,
  },
  {
    id: 'seed-selftalk',
    title: 'Catch the spiral early',
    detail: 'When I notice a thought repeating for the third time, say it out loud instead of rehearsing it.',
    createdAt: 0,
  },
  {
    id: 'seed-rest',
    title: 'Protect the wind-down hour',
    detail: 'No work after 10pm. Journal first, then sleep.',
    createdAt: 0,
  },
];

type IntentionsApi = {
  intentions: Intention[];
  hydrated: boolean;
  addIntention: (input: { title: string; detail: string }) => void;
  updateIntention: (id: string, patch: Partial<Pick<Intention, 'title' | 'detail'>>) => void;
  removeIntention: (id: string) => void;
};

const IntentionsContext = createContext<IntentionsApi | null>(null);

export function IntentionsProvider({ children }: { children: React.ReactNode }) {
  const { value, setValue, hydrated } = usePersistentState<Intention[]>(STORAGE_KEY, SEED);

  const addIntention = useCallback<IntentionsApi['addIntention']>(
    ({ title, detail }) => {
      setValue((prev) => [...prev, { id: makeId(), title, detail, createdAt: Date.now() }]);
    },
    [setValue],
  );

  const updateIntention = useCallback<IntentionsApi['updateIntention']>(
    (id, patch) => {
      setValue((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    [setValue],
  );

  const removeIntention = useCallback<IntentionsApi['removeIntention']>(
    (id) => setValue((prev) => prev.filter((i) => i.id !== id)),
    [setValue],
  );

  const api = useMemo<IntentionsApi>(
    () => ({ intentions: value, hydrated, addIntention, updateIntention, removeIntention }),
    [value, hydrated, addIntention, updateIntention, removeIntention],
  );

  return <IntentionsContext.Provider value={api}>{children}</IntentionsContext.Provider>;
}

export function useIntentions() {
  const ctx = useContext(IntentionsContext);
  if (!ctx) throw new Error('useIntentions must be used inside <IntentionsProvider>');
  return ctx;
}
