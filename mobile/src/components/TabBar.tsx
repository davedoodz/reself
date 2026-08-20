import type { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon, LibraryIcon, PlusIcon, ProfileIcon, SettingsIcon, StickyNoteIcon } from '../icons';
import { color, layout, radius, space } from '../theme';
import type { CoachTarget } from '../store/tutorial';

/**
 * Derived from the navigator rather than importing `@react-navigation/bottom-tabs`
 * directly — expo-router vendors react-navigation and does not re-export it at a
 * stable public path.
 */
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

type TabDef = {
  name: string;
  target: Extract<CoachTarget, 'intentions' | 'entries' | 'profile' | 'settings'>;
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.JSX.Element;
  size: number;
};

/** Left pair, then the FAB, then the right pair — the order drawn in m7. */
const LEFT_TABS: readonly TabDef[] = [
  { name: 'intentions', target: 'intentions', label: 'List of Intentions', Icon: StickyNoteIcon, size: 28 },
  { name: 'entries', target: 'entries', label: 'Journal Entries', Icon: LibraryIcon, size: 28 },
];

const RIGHT_TABS: readonly TabDef[] = [
  { name: 'profile', target: 'profile', label: 'Profile', Icon: ProfileIcon, size: 29 },
  { name: 'settings', target: 'settings', label: 'Settings', Icon: SettingsIcon, size: 26 },
];

export function TabBar({
  state,
  navigation,
  recorderOpen,
  onToggleRecorder,
  onTabPress,
}: TabBarProps & {
  recorderOpen: boolean;
  onToggleRecorder: () => void;
  /** Lets the tutorial intercept a tap to advance the walkthrough. */
  onTabPress?: (target: CoachTarget) => boolean | void;
}) {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  const renderTab = (tab: TabDef) => {
    const focused = activeName === tab.name;
    return (
      <Pressable
        key={tab.name}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={tab.label}
        hitSlop={8}
        onPress={() => {
          if (onTabPress?.(tab.target) === true) return;
          if (!focused) navigation.navigate(tab.name);
        }}
        style={styles.slot}
      >
        <tab.Icon size={tab.size} color={focused ? color.ink : color.brandStrong} />
        <View style={[styles.dot, focused && styles.dotActive]} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, space.sm) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {LEFT_TABS.map(renderTab)}
        <View style={styles.fabGap} />
        {RIGHT_TABS.map(renderTab)}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={recorderOpen ? 'Close recorder' : 'Open recorder'}
        accessibilityState={{ expanded: recorderOpen }}
        onPress={() => {
          if (onTabPress?.('fab') === true) return;
          onToggleRecorder();
        }}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        {recorderOpen ? (
          <CloseIcon size={26} color={color.ink} />
        ) : (
          <PlusIcon size={26} color={color.ink} />
        )}
      </Pressable>
    </View>
  );
}

/** Disc diameter (75) and the canvas-coloured ring drawn around it (87 total). */
const FAB = layout.fabSize;
const FAB_RING = 6;
/** Group 1356 is 316x92 with Group 1320 (the bar) at y=38 — the disc overhang. */
const FAB_OVERHANG = 38;

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: space.gutter,
    // Reserves the disc overhang so the bar lands where it does in the file.
    paddingTop: FAB_OVERHANG,
  },
  bar: {
    width: '100%',
    maxWidth: layout.content,
    height: layout.tabBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.line,
  },
  // Equal-weight slots keep the four icons on fixed lanes regardless of glyph width.
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  fabGap: {
    width: FAB,
    flexShrink: 0,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: radius.pill,
    marginTop: 3,
    backgroundColor: 'transparent',
  },
  dotActive: {
    backgroundColor: color.ink,
  },
  fab: {
    position: 'absolute',
    // Border box is 87; the -FAB_RING offset puts the 75px disc flush at y=0,
    // so it overhangs the bar by exactly 38px and sinks 37px into it.
    top: -FAB_RING,
    width: FAB + FAB_RING * 2,
    height: FAB + FAB_RING * 2,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    borderWidth: FAB_RING,
    borderColor: color.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: {
    opacity: 0.85,
  },
});
