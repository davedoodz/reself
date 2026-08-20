import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DocumentIcon, MicIcon, StickyNoteIcon, TextAlignLeftIcon } from '../icons';
import { color, font, layout, radius, space, text } from '../theme';
import type { EntryMode, EntryStyle } from '../store/entries';
import { ChoiceCard } from './ChoiceCard';

/**
 * The recorder chooser from m16-m19, collapsed into one two-step sheet.
 *
 * Those four artboards were the same card with different selections baked in.
 * Step 1 picks talking vs writing, step 2 picks free-form vs guided, then the
 * sheet hands both back and closes.
 */
export function RecorderSheet({
  visible,
  onDismiss,
  onConfirm,
}: {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (choice: { mode: EntryMode; style: EntryStyle }) => void;
}) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<EntryMode | null>(null);

  // Reopening should always start at step 1, never mid-flow.
  useEffect(() => {
    if (!visible) setMode(null);
  }, [visible]);

  if (!visible) return null;

  const bottom = layout.tabBarHeight + Math.max(insets.bottom, space.sm) + space.xl;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Close recorder"
      />

      <View style={[styles.sheet, { bottom }]} accessibilityViewIsModal>
        {mode === null ? (
          <>
            <Text style={styles.prompt}>How would you like to journal?</Text>
            <ChoiceCard label="Talking" Icon={MicIcon} selected={false} onPress={() => setMode('talking')} />
            <ChoiceCard
              label="Writing"
              Icon={TextAlignLeftIcon}
              selected={false}
              onPress={() => setMode('writing')}
            />
          </>
        ) : (
          <>
            <Pressable onPress={() => setMode(null)} hitSlop={10} accessibilityRole="button">
              <Text style={styles.back}>{mode === 'talking' ? 'Talking' : 'Writing'} · change</Text>
            </Pressable>
            <Text style={styles.prompt}>Free-form or guided?</Text>
            <ChoiceCard
              label="Free-form"
              Icon={StickyNoteIcon}
              selected={false}
              onPress={() => onConfirm({ mode, style: 'free-form' })}
            />
            <ChoiceCard
              label="Guided"
              Icon={DocumentIcon}
              selected={false}
              onPress={() => onConfirm({ mode, style: 'guided' })}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: space.gutter,
    right: space.gutter,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.lg,
    gap: space.md,
  },
  prompt: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.ink,
    marginBottom: space.xs,
  },
  back: {
    fontFamily: font.medium,
    fontSize: text.caption,
    lineHeight: 18,
    color: color.inkMuted,
    textDecorationLine: 'underline',
  },
});
