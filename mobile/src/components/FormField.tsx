import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { color, font, radius, space, text, type as t } from '../theme';

/** Label above a bordered input — the Name / Email pattern from m13. */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  ...rest
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'multiline' | 'style'>) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.inkMuted}
        multiline={multiline}
        accessibilityLabel={label}
        style={[styles.input, multiline && styles.multiline]}
        {...rest}
      />
    </View>
  );
}

/** Read-only value under a label, for fields the user cannot edit. */
export function StaticField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.static}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: space.xs,
    marginBottom: space.lg,
  },
  label: {
    ...t.caption,
    fontFamily: font.semibold,
  },
  input: {
    minHeight: 44,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: color.surface,
    borderRadius: radius.field,
    borderWidth: 1,
    borderColor: color.line,
    fontFamily: font.body,
    fontSize: text.lead,
    lineHeight: 26,
    color: color.ink,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  static: {
    ...t.lead,
    paddingVertical: space.sm,
  },
});
