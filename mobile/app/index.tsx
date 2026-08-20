import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { useProfile } from '../src/store/profile';
import { color, font, radius, space, text, type as t } from '../src/theme';

/**
 * m1_home / m2_home>getstarted.
 *
 * Those were two artboards differing only by the button's pressed state, which
 * is a Pressable style callback, not a screen.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { profile, hydrated } = useProfile();

  if (!hydrated) return <View style={styles.blank} />;

  // A returning user should never see the splash again.
  if (profile.joinedAt) return <Redirect href="/(tabs)/entries" />;

  return (
    <Screen contentStyle={styles.layout}>
      <View style={styles.halo} pointerEvents="none" />

      <View style={styles.wordmark}>
        <Text style={styles.brand}>RE:SELF</Text>
        <Text style={styles.tagline}>Speak your mind.</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Get Started" onPress={() => router.push('/welcome')} />
        <Text style={styles.login}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
        <Text style={styles.terms}>
          By continuing, you agree to our terms and conditions and our privacy policy
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  blank: { flex: 1, backgroundColor: color.canvas },
  layout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // Ellipse 396.
  halo: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    opacity: 0.3,
    top: '14%',
    alignSelf: 'center',
  },
  wordmark: {
    marginTop: '42%',
  },
  brand: {
    fontFamily: font.extrabold,
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -1.3,
    color: color.ink,
  },
  tagline: {
    ...t.lead,
    color: color.inkMuted,
  },
  actions: {
    gap: space.md,
  },
  login: {
    ...t.body,
    textAlign: 'center',
  },
  loginLink: {
    fontFamily: font.semibold,
    textDecorationLine: 'underline',
  },
  terms: {
    fontFamily: font.body,
    fontSize: text.caption,
    lineHeight: 18,
    color: color.inkMuted,
    textAlign: 'center',
  },
});
