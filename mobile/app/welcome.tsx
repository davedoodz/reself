import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FormField } from '../src/components/FormField';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { Screen } from '../src/components/Screen';
import { useProfile } from '../src/store/profile';
import { color, radius, space, type as t } from '../src/theme';

/**
 * m3_welcome.
 *
 * The artboard is copy only. Name and email are collected here because m13
 * shows both as populated profile fields and nothing else ever asks for them.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const { updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const canContinue = name.trim().length > 0;

  return (
    <Screen scroll contentStyle={styles.layout}>
      <View style={styles.halo} pointerEvents="none" />

      <Text style={styles.copy}>
        Hi there, welcome to RE:SELF.{'\n\n'}
        This is a voice-first journaling system designed to help break negative cycles, backed by
        research from MIT &amp; Harvard.{'\n\n'}
        Let’s walk through together how this mobile app works.
      </Text>

      <View style={styles.form}>
        <FormField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Michelle"
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
        />
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.edu"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      <PrimaryButton
        label="Get Started"
        disabled={!canContinue}
        onPress={() => {
          updateProfile({ name: name.trim(), email: email.trim(), joinedAt: Date.now() });
          router.replace('/(tabs)/entries');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: space.xl,
  },
  halo: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    opacity: 0.25,
    top: 0,
    alignSelf: 'center',
  },
  copy: {
    ...t.lead,
  },
  form: {
    marginTop: space.sm,
  },
});
