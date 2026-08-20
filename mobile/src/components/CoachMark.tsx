import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ArrowDownIcon,
  LibraryIcon,
  PlusIcon,
  ProfileIcon,
  SettingsIcon,
  StickyNoteIcon,
} from '../icons';
import { color, font, layout, radius, space, text, type as t } from '../theme';
import type { CoachStep, CoachTarget } from '../store/tutorial';

const ICON_BY_TARGET: Record<CoachTarget, (p: { size?: number; color?: string }) => React.JSX.Element> = {
  fab: PlusIcon,
  intentions: StickyNoteIcon,
  entries: LibraryIcon,
  profile: ProfileIcon,
  settings: SettingsIcon,
};

/** Horizontal centre of each affordance, as a fraction of the dock width. */
const ANCHOR_BY_TARGET: Record<CoachTarget, number> = {
  intentions: 0.12,
  entries: 0.31,
  fab: 0.5,
  profile: 0.69,
  settings: 0.88,
};

/**
 * The tutorial overlay from artboards m4 / m6 / m8 / m12 / m14.
 *
 * Those were five separate frames duplicating the whole screen. Here it is one
 * overlay driven by `step`, sitting above the content but below the tab bar so
 * the affordance it describes stays visible and tappable.
 */
export function CoachMark({
  step,
  index,
  count,
  onAdvance,
  onSkip,
}: {
  step: CoachStep;
  index: number;
  count: number;
  onAdvance: () => void;
  onSkip: () => void;
}) {
  const insets = useSafeAreaInsets();
  const Icon = ICON_BY_TARGET[step.target];
  const anchor = ANCHOR_BY_TARGET[step.target];

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Sibling of the copy, not its parent: nesting the Skip button inside the
          scrim button produced nested interactive elements. */}
      <Pressable
        style={styles.scrim}
        onPress={onAdvance}
        accessibilityRole="button"
        accessibilityLabel={`Tutorial step ${index + 1} of ${count}. Tap to continue.`}
      />

      <View style={styles.halo} pointerEvents="none" />

      <View style={styles.copy} pointerEvents="none">
        <View style={styles.ledeRow}>
          <Text style={styles.lede}>The</Text>
          <View style={styles.ledeIcon}>
            <Icon size={22} color={color.ink} />
          </View>
          <Text style={[styles.lede, styles.ledeTail]}>{step.lede}</Text>
        </View>
        <Text style={styles.body}>{step.body}</Text>
        <Text style={styles.action}>{step.action}</Text>
      </View>

      <View style={styles.footer} pointerEvents="box-none">
        <View style={styles.dots}>
          {Array.from({ length: count }, (_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Pressable onPress={onSkip} hitSlop={12} accessibilityRole="button">
          <Text style={styles.skip}>Skip tour</Text>
        </Pressable>
      </View>

      {/* Points down at the affordance being described. */}
      <View
        style={[
          styles.arrow,
          {
            bottom: layout.tabBarHeight + Math.max(insets.bottom, space.sm) + space.lg,
            left: `${anchor * 100}%`,
          },
        ]}
        pointerEvents="none"
      >
        <ArrowDownIcon size={30} color={color.ink} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: space.gutter,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: color.canvas,
  },
  // Ellipse 396, the 230px soft disc behind the tutorial copy.
  halo: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    opacity: 0.28,
    top: '12%',
    alignSelf: 'center',
  },
  copy: {
    gap: space.lg,
  },
  // Icon sits inline with the sentence, as drawn, without nesting SVG in Text —
  // which renders inconsistently on Android.
  ledeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  lede: {
    ...t.lead,
    fontFamily: font.semibold,
  },
  ledeIcon: {
    transform: [{ translateY: 2 }],
  },
  ledeTail: {
    flexShrink: 1,
  },
  body: {
    ...t.lead,
    fontFamily: font.body,
    color: color.inkMuted,
  },
  action: {
    ...t.lead,
    fontFamily: font.semibold,
  },
  footer: {
    position: 'absolute',
    left: space.gutter,
    right: space.gutter,
    bottom: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: {
    flexDirection: 'row',
    gap: space.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
  },
  dotActive: {
    backgroundColor: color.ink,
  },
  skip: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.inkMuted,
    textDecorationLine: 'underline',
  },
  arrow: {
    position: 'absolute',
    marginLeft: -15,
  },
});
