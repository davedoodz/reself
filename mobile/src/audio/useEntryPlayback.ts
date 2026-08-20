import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

import { audioUri, type Entry } from '../store/entries';

/**
 * One player for the whole list, so a second tap never leaves two entries
 * talking over each other.
 *
 * The player is created once with no source and re-pointed via `replace`,
 * rather than recreating it per selection — `useAudioPlayer` tears down and
 * rebuilds the native object whenever its source argument changes.
 */
export function useEntryPlayback() {
  const player = useAudioPlayer(null, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = activeId;

  // Release the row highlight when the clip runs out.
  useEffect(() => {
    if (status.didJustFinish) setActiveId(null);
  }, [status.didJustFinish]);

  const toggle = useCallback(
    (entry: Entry) => {
      const uri = audioUri(entry);
      if (!uri) return;

      if (activeIdRef.current === entry.id) {
        if (status.playing) player.pause();
        else player.play();
        return;
      }

      player.replace({ uri });
      player.seekTo(0);
      player.play();
      setActiveId(entry.id);
    },
    [player, status.playing],
  );

  const stop = useCallback(() => {
    player.pause();
    setActiveId(null);
  }, [player]);

  /** 0..1 for the active entry; 0 for every other row. */
  const progressFor = useCallback(
    (entry: Entry) => {
      if (activeId !== entry.id) return 0;
      const total = status.duration || (entry.durationMs ?? 0) / 1000;
      if (!total) return 0;
      return Math.min(1, status.currentTime / total);
    },
    [activeId, status.duration, status.currentTime],
  );

  return {
    activeId,
    isPlaying: (entry: Entry) => activeId === entry.id && status.playing,
    progressFor,
    toggle,
    stop,
  } as const;
}
