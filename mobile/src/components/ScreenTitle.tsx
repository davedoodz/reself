import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { space, type as t } from '../theme';

/**
 * The 32px centred screen heading.
 *
 * The artboards set this in "Tamil MN" — a local macOS Tamil-script face with
 * only 400/700, applied to Latin text. It does not exist on iOS or Android and
 * would have silently fallen back. Rendered in Afacad Flux here.
 */
export function ScreenTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={styles.title} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    ...t.title,
    textAlign: 'center',
    marginBottom: space.xl,
  },
});
