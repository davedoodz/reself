import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space, text } from '../theme';

/**
 * The 275x49 option pill from the recorder sheet — Talking / Writing in m16,
 * Free-form / Guided in m18. Selected state matches m17 and m19.
 */
export function ChoiceCard({
  label,
  Icon,
  selected,
  onPress,
}: {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.JSX.Element;
  selected: boolean;
  onPress: () => void;
}) {
  const tint = selected ? color.ink : color.brandStrong;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.pill, selected && styles.selected, pressed && styles.pressed]}
    >
      <View style={styles.iconSlot}>
        <Icon size={24} color={tint} />
      </View>
      <Text style={[styles.label, { color: selected ? color.ink : color.inkMuted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    gap: space.md,
    backgroundColor: color.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.line,
  },
  selected: {
    backgroundColor: color.brand,
    borderColor: color.brandStrong,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  // Fixed slot so both option labels start on the same vertical lane.
  iconSlot: {
    width: 24,
    flexShrink: 0,
    alignItems: 'center',
  },
  label: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
  },
});
