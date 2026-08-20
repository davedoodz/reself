import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { color, font, leading, radius, text } from '../theme';

/** The 90px disc from m13 — a photo, or the name's initial on the brand fill. */
export function Avatar({
  initial,
  uri,
  size = 90,
}: {
  initial: string;
  uri?: string | null;
  size?: number;
}) {
  const dimension = { width: size, height: size, borderRadius: radius.pill };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.disc, dimension]}
        accessibilityIgnoresInvertColors
        accessibilityLabel="Profile picture"
      />
    );
  }

  return (
    <View style={[styles.disc, dimension]} accessibilityLabel={`Profile initial ${initial}`}>
      <Text style={[styles.initial, { fontSize: size * 0.53, lineHeight: size * 0.62 }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Size and line-height are supplied per instance from `size`; the file set
  // 48px type on a 26px line-height, which clipped the glyph.
  initial: {
    fontFamily: font.extrabold,
    color: color.onBrand,
    textAlign: 'center',
  },
});
