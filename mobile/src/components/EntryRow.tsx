import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CloseIcon, PauseCircleIcon, PlayCircleIcon, TextAlignLeftIcon } from '../icons';
import { color, font, layout, radius, space, text, type as t } from '../theme';
import { formatDuration, formatTimeOfDay } from '../format';
import { wordCount, type Entry } from '../store/entries';

export function EntryRow({
  entry,
  playing,
  /** 0..1, only meaningful while `playing`. Drives the fill behind the row. */
  progress,
  armedForDelete,
  onPress,
  onLongPress,
  onDelete,
}: {
  entry: Entry;
  playing: boolean;
  progress: number;
  armedForDelete: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
}) {
  const isVoice = entry.mode === 'talking';
  const timeLabel = formatTimeOfDay(entry.createdAt);
  const trailing = isVoice
    ? formatDuration(entry.durationMs ?? 0)
    : `${wordCount(entry.body)} words`;

  const a11yLabel = isVoice
    ? `Voice entry at ${timeLabel}, ${trailing}`
    : `Written entry at ${timeLabel}, ${trailing}`;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={350}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint={isVoice ? 'Plays this entry. Long press to delete.' : 'Opens this entry. Long press to delete.'}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        {playing ? (
          <View
            style={[styles.progress, { width: `${Math.min(100, Math.max(0, progress * 100))}%` }]}
            pointerEvents="none"
          />
        ) : null}

        <View style={styles.leading}>
          {isVoice ? (
            playing ? (
              <PauseCircleIcon size={29} />
            ) : (
              <PlayCircleIcon size={29} />
            )
          ) : (
            <TextAlignLeftIcon size={24} />
          )}
        </View>

        <Text style={styles.time} numberOfLines={1}>
          {timeLabel}
        </Text>

        <Text style={styles.trailing} numberOfLines={1}>
          {trailing}
        </Text>
      </Pressable>

      {armedForDelete ? (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete entry from ${timeLabel}`}
          hitSlop={10}
          style={({ pressed }) => [styles.deleteBadge, pressed && styles.pressed]}
        >
          <CloseIcon size={14} color={color.surface} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: space.md,
  },
  row: {
    height: layout.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    gap: space.md,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    // Clips the playback fill to the rounded corners.
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: color.brand,
    opacity: 0.35,
  },
  // Fixed-width slot so the play icon and the text-entry icon share one
  // vertical lane across rows of both kinds.
  leading: {
    width: 29,
    flexShrink: 0,
    alignItems: 'center',
  },
  time: {
    ...t.caption,
    flex: 1,
  },
  trailing: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.inkMuted,
    textAlign: 'right',
    // Fixed slot keeps "0:44" and "254 words" right-aligned in the same lane.
    minWidth: 76,
    flexShrink: 0,
  },
  deleteBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
