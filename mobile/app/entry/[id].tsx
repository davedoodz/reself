import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { formatTimeOfDay } from '../../src/format';
import { CloseIcon } from '../../src/icons';
import { useEntries, wordCount } from '../../src/store/entries';
import { color, font, space, text, type as t } from '../../src/theme';

/**
 * Reading a written entry.
 *
 * No artboard covers this: the file shows written entries in the list with a
 * word count, but tapping one had nowhere to go. Voice entries play in place,
 * so only text needs a detail view.
 */
export default function EntryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, removeEntry } = useEntries();
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <Screen contentStyle={styles.missing}>
        <Text style={t.bodyMuted}>That entry is no longer here.</Text>
      </Screen>
    );
  }

  const words = wordCount(entry.body);
  const date = new Date(entry.createdAt);

  return (
    <Screen scroll>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back to journal entries"
        style={styles.close}
      >
        <CloseIcon size={24} color={color.ink} />
      </Pressable>

      <Text style={styles.stamp}>
        {date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ·{' '}
        {formatTimeOfDay(entry.createdAt)} · {words} {words === 1 ? 'word' : 'words'}
      </Text>

      {entry.prompt ? <Text style={styles.prompt}>{entry.prompt}</Text> : null}
      <Text style={styles.body}>{entry.body}</Text>

      <Pressable
        onPress={() => {
          removeEntry(entry.id);
          router.back();
        }}
        hitSlop={8}
        accessibilityRole="button"
        style={styles.deleteWrap}
      >
        <Text style={styles.delete}>Delete this entry</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    alignSelf: 'flex-end',
  },
  stamp: {
    ...t.caption,
    marginBottom: space.lg,
  },
  prompt: {
    fontFamily: font.semibold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: color.ink,
    marginBottom: space.lg,
  },
  body: {
    fontFamily: font.body,
    fontSize: text.lead,
    lineHeight: 30,
    color: color.ink,
  },
  deleteWrap: {
    marginTop: space.xl,
    alignSelf: 'flex-start',
  },
  delete: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.danger,
  },
});
