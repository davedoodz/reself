import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { color, radius, space } from '../theme';

/**
 * The white rounded surface used by entry rows, intention cards, fields, and
 * sheets.
 *
 * In the artboards this was an SVG with two paths — one fill, one an ~800
 * character hand-traced outline standing in for a border, with an accidentally
 * asymmetric radius (24px top, 29px bottom). Here it is a border and a radius.
 */
export function Card({
  children,
  style,
  onPress,
  selected = false,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  /** Selected cards invert to the brand fill, as in m17 and m19. */
  selected?: boolean;
  accessibilityLabel?: string;
}) {
  const body = <View style={[styles.card, selected && styles.selected, style]}>{children}</View>;

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  selected: {
    backgroundColor: color.brand,
    borderColor: color.brandStrong,
  },
  pressed: {
    opacity: 0.7,
  },
});
