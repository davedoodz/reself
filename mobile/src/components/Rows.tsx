import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { ChevronIcon } from '../icons';
import { color, font, radius, space, text, type as t } from '../theme';

/** "Today, 1 entry" / "May 18th, 4 entries". */
export function DayGroupHeader({ label }: { label: string }) {
  return (
    <Text style={styles.groupHeader} accessibilityRole="header">
      {label}
    </Text>
  );
}

/** Section label above a run of settings rows. */
export function SectionHeader({ label }: { label: string }) {
  return (
    <Text style={styles.sectionHeader} accessibilityRole="header">
      {label}
    </Text>
  );
}

/** A settings line with a leading icon and a trailing chevron. */
export function DisclosureRow({
  label,
  Icon,
  onPress,
  destructive = false,
  expanded,
}: {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.JSX.Element;
  onPress: () => void;
  destructive?: boolean;
  /** Supplied when the row expands in place rather than navigating. */
  expanded?: boolean;
}) {
  const tint = destructive ? color.danger : color.brandStrong;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={expanded === undefined ? undefined : { expanded }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.iconSlot}>
        <Icon size={20} color={tint} />
      </View>
      <Text style={[styles.rowLabel, destructive && { color: color.danger }]}>{label}</Text>
      <View style={styles.iconSlot}>
        <ChevronIcon size={18} color={tint} open={expanded} />
      </View>
    </Pressable>
  );
}

/** A settings line with a trailing switch. */
export function ToggleRow({
  label,
  Icon,
  value,
  onValueChange,
}: {
  label: string;
  Icon: (p: { size?: number; color?: string }) => React.JSX.Element;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconSlot}>
        <Icon size={20} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{ true: color.brand, false: '#D6E7F3' }}
        thumbColor={color.surface}
      />
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  groupHeader: {
    ...t.caption,
    marginBottom: space.sm,
    marginTop: space.lg,
  },
  sectionHeader: {
    fontFamily: font.semibold,
    fontSize: text.lead,
    lineHeight: 26,
    color: color.ink,
    marginTop: space.xl,
    marginBottom: space.sm,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  pressed: {
    opacity: 0.6,
  },
  // Fixed slots put every leading icon and trailing chevron on one lane.
  iconSlot: {
    width: 22,
    flexShrink: 0,
    alignItems: 'center',
  },
  rowLabel: {
    ...t.lead,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: color.line,
    opacity: 0.5,
    borderRadius: radius.pill,
  },
});
