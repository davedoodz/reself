import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, layout, space } from '../theme';

/**
 * Canvas + safe-area padding + the 43px gutter.
 *
 * The artboards redrew the iOS status bar (battery, WiFi, cellular, dynamic
 * island) as ~15 vector nodes on all 23 frames. None of that is built here —
 * the OS renders it, and `useSafeAreaInsets` reserves the room.
 */
export function Screen({
  children,
  scroll = false,
  padBottomForTabBar = false,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  /** Keep content clear of the floating tab bar and its FAB. */
  padBottomForTabBar?: boolean;
  contentStyle?: ViewStyle;
}) {
  const insets = useSafeAreaInsets();
  const bottomPad =
    (padBottomForTabBar ? layout.tabBarHeight + space.xl * 2 : 0) + Math.max(insets.bottom, space.lg);

  const inner: ViewStyle = {
    paddingTop: insets.top + space.lg,
    paddingBottom: bottomPad,
    paddingHorizontal: space.gutter,
  };

  if (!scroll) {
    return <View style={[styles.canvas, inner, contentStyle]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.canvas}
      contentContainerStyle={[inner, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: color.canvas,
  },
});
