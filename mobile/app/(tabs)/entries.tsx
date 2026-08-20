import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useEntryPlayback } from '../../src/audio/useEntryPlayback';
import { EntryRow } from '../../src/components/EntryRow';
import { DayGroupHeader } from '../../src/components/Rows';
import { Screen } from '../../src/components/Screen';
import { ScreenTitle } from '../../src/components/ScreenTitle';
import { groupByDay, useEntries, type Entry } from '../../src/store/entries';
import { space, type as t } from '../../src/theme';

/**
 * m8-m11, collapsed.
 *
 * m8/m9 were tutorial-overlay-off/on, m10 was one row mid-playback, and m11 was
 * one row showing its delete badge. All three are row state, not screens.
 */
export default function EntriesScreen() {
  const router = useRouter();
  const { entries, removeEntry, hydrated } = useEntries();
  const playback = useEntryPlayback();
  const [armedId, setArmedId] = useState<string | null>(null);

  const groups = useMemo(() => groupByDay(entries), [entries]);

  const openEntry = (entry: Entry) => {
    if (entry.mode === 'talking') playback.toggle(entry);
    else router.push({ pathname: '/entry/[id]', params: { id: entry.id } });
  };

  return (
    <Screen scroll padBottomForTabBar>
      <ScreenTitle>Journal Entries</ScreenTitle>

      {hydrated && entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nothing here yet.</Text>
          <Text style={styles.emptyBody}>
            Tap the button below to record or write your first entry.
          </Text>
        </View>
      ) : null}

      {groups.map((group) => (
        <View key={group.key}>
          <DayGroupHeader label={group.label} />
          {group.entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              playing={playback.isPlaying(entry)}
              progress={playback.progressFor(entry)}
              armedForDelete={armedId === entry.id}
              onPress={() => {
                if (armedId) setArmedId(null);
                else openEntry(entry);
              }}
              onLongPress={() => setArmedId(entry.id)}
              onDelete={() => {
                if (playback.activeId === entry.id) playback.stop();
                removeEntry(entry.id);
                setArmedId(null);
              }}
            />
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: '30%',
    gap: space.sm,
  },
  emptyTitle: {
    ...t.lead,
    textAlign: 'center',
  },
  emptyBody: {
    ...t.bodyMuted,
    textAlign: 'center',
  },
});
