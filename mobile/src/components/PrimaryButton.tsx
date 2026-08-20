import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, layout, radius, text } from '../theme';

/** The 316x54 pill from "Get Started". */
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: layout.tabBarHeight,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: font.semibold,
    fontSize: text.lead,
    lineHeight: 26,
    // White on #7EBFEC is only 2:1, so the label takes the deep ink instead.
    color: color.ink,
  },
});
