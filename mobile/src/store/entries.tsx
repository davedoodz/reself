import { Directory, File, Paths } from 'expo-file-system';
import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { makeId, usePersistentState } from './persist';

export type EntryMode = 'talking' | 'writing';
export type EntryStyle = 'free-form' | 'guided';

export type Entry = {
  id: string;
  mode: EntryMode;
  style: EntryStyle;
  /** Epoch ms. Groups and sorts the list. */
  createdAt: number;
  /** Guided entries carry the prompt they answered. */
  prompt?: string;
  /** `talking`: filename inside the audio directory. Not an absolute path — an
   *  app container path changes between installs and OS upgrades on iOS. */
  audioFile?: string;
  /** `talking`: recorded length in ms. */
  durationMs?: number;
  /** `writing`: the entry text. */
  body?: string;
};

const STORAGE_KEY = 'reself.entries.v1';

/**
 * Audio lives on disk, not in AsyncStorage — only the filename is persisted.
 *
 * Resolved lazily: touching `Paths.document` at module scope would run on
 * import, before any screen has mounted, and platforms without a document
 * directory would throw during bundle evaluation rather than at the call site.
 */
let audioDirCache: Directory | null = null;

function getAudioDir(): Directory {
  audioDirCache ??= new Directory(Paths.document, 'entries');
  return audioDirCache;
}

function ensureAudioDir(): Directory {
  const dir = getAudioDir();
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

/** Resolve a stored filename to a URI usable by the player, at read time. */
export function audioUri(entry: Entry): string | null {
  if (!entry.audioFile) return null;
  return new File(getAudioDir(), entry.audioFile).uri;
}

export function wordCount(body: string | undefined): number {
  if (!body) return 0;
  const trimmed = body.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

type EntriesApi = {
  entries: Entry[];
  hydrated: boolean;
  addVoiceEntry: (input: {
    sourceUri: string;
    durationMs: number;
    style: EntryStyle;
    prompt?: string;
  }) => Promise<Entry>;
  addTextEntry: (input: { body: string; style: EntryStyle; prompt?: string }) => Entry;
  removeEntry: (id: string) => void;
};

const EntriesContext = createContext<EntriesApi | null>(null);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const { value: entries, setValue, hydrated } = usePersistentState<Entry[]>(STORAGE_KEY, []);

  const addVoiceEntry = useCallback<EntriesApi['addVoiceEntry']>(
    async ({ sourceUri, durationMs, style, prompt }) => {
      const dir = ensureAudioDir();
      const id = makeId();
      // Keep the recorder's container format; re-encoding here would be lossy
      // and pointless. iOS/Android both produce .m4a with the HIGH_QUALITY preset.
      const extension = sourceUri.split('.').pop()?.split('?')[0] || 'm4a';
      const filename = `${id}.${extension}`;
      const source = new File(sourceUri);
      const target = new File(dir, filename);
      source.move(target);

      const entry: Entry = {
        id,
        mode: 'talking',
        style,
        prompt,
        createdAt: Date.now(),
        audioFile: filename,
        durationMs,
      };
      setValue((prev) => [entry, ...prev]);
      return entry;
    },
    [setValue],
  );

  const addTextEntry = useCallback<EntriesApi['addTextEntry']>(
    ({ body, style, prompt }) => {
      const entry: Entry = {
        id: makeId(),
        mode: 'writing',
        style,
        prompt,
        createdAt: Date.now(),
        body,
      };
      setValue((prev) => [entry, ...prev]);
      return entry;
    },
    [setValue],
  );

  const removeEntry = useCallback<EntriesApi['removeEntry']>(
    (id) => {
      setValue((prev) => {
        const doomed = prev.find((e) => e.id === id);
        if (doomed?.audioFile) {
          // Orphaned audio would silently consume storage forever.
          try {
            const file = new File(getAudioDir(), doomed.audioFile);
            if (file.exists) file.delete();
          } catch {
            // A missing file is not a reason to block the delete.
          }
        }
        return prev.filter((e) => e.id !== id);
      });
    },
    [setValue],
  );

  const sorted = useMemo(() => [...entries].sort((a, b) => b.createdAt - a.createdAt), [entries]);

  const api = useMemo<EntriesApi>(
    () => ({ entries: sorted, hydrated, addVoiceEntry, addTextEntry, removeEntry }),
    [sorted, hydrated, addVoiceEntry, addTextEntry, removeEntry],
  );

  return <EntriesContext.Provider value={api}>{children}</EntriesContext.Provider>;
}

export function useEntries() {
  const ctx = useContext(EntriesContext);
  if (!ctx) throw new Error('useEntries must be used inside <EntriesProvider>');
  return ctx;
}

export type EntryGroup = { key: string; label: string; entries: Entry[] };

/**
 * Bucket entries by calendar day, newest first, matching the artboards'
 * "Today, 1 entry" / "May 18th, 4 entries" headers.
 */
export function groupByDay(entries: Entry[], now = new Date()): EntryGroup[] {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const d = new Date(entry.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }

  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  return [...groups.entries()].map(([key, list]) => {
    const d = new Date(list[0].createdAt);
    const day =
      key === todayKey
        ? 'Today'
        : key === yesterdayKey
          ? 'Yesterday'
          : `${d.toLocaleString('en-US', { month: 'long' })} ${ordinal(d.getDate())}`;
    const count = list.length;
    return { key, label: `${day}, ${count} ${count === 1 ? 'entry' : 'entries'}`, entries: list };
  });
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
