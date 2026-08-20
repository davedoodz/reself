import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { ScreenTitle } from '../../src/components/ScreenTitle';
import { DisclosureRow, Divider, SectionHeader, ToggleRow } from '../../src/components/Rows';
import {
  BellIcon,
  CandleIcon,
  DocumentIcon,
  ProfileDeleteIcon,
  QuestionIcon,
  ShieldIcon,
} from '../../src/icons';
import { useEntries } from '../../src/store/entries';
import { useProfile } from '../../src/store/profile';
import { useTutorial } from '../../src/store/tutorial';
import { color, font, space, text, type as t } from '../../src/theme';

const RESEARCH_URL = 'https://www.media.mit.edu/';
const PRIVACY_URL = 'https://example.com/reself/privacy';
const TERMS_URL = 'https://example.com/reself/terms';

const FAQ: readonly { q: string; a: string }[] = [
  {
    q: 'Where are my recordings stored?',
    a: 'On this device only, inside the app’s private container. Nothing is uploaded.',
  },
  {
    q: 'What happens when I delete an entry?',
    a: 'The audio file is removed from disk immediately, along with its record.',
  },
  {
    q: 'What is the difference between free-form and guided?',
    a: 'Free-form gives you a blank recorder. Guided opens with a prompt drawn from the research.',
  },
];

/**
 * m14_tutorial>settings1 / m15...settings2.
 *
 * m15 drew every row and section divider as separate absolutely positioned
 * nodes — 34 direct children. Here the rows are data.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { profile, updateProfile, signOut } = useProfile();
  const { entries, removeEntry } = useEntries();
  const { restart } = useTutorial();
  const [faqOpen, setFaqOpen] = useState(false);

  const deleteAccount = () => {
    Alert.alert(
      'Delete account',
      `This removes your profile and all ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}, including the audio on this device. It cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            for (const entry of entries) removeEntry(entry.id);
            signOut();
            router.replace('/');
          },
        },
      ],
    );
  };

  return (
    <Screen scroll padBottomForTabBar>
      <ScreenTitle>Settings</ScreenTitle>

      <ToggleRow
        label="Notifications"
        Icon={BellIcon}
        value={profile.notificationsEnabled}
        onValueChange={(notificationsEnabled) => updateProfile({ notificationsEnabled })}
      />
      <Divider />

      <SectionHeader label="Support" />
      <DisclosureRow
        label="Frequently Asked Questions"
        Icon={QuestionIcon}
        expanded={faqOpen}
        onPress={() => setFaqOpen((open) => !open)}
      />
      {faqOpen ? (
        <View style={styles.faq}>
          {FAQ.map((item) => (
            <View key={item.q} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              <Text style={styles.faqAnswer}>{item.a}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <DisclosureRow
        label="Replay the walkthrough"
        Icon={CandleIcon}
        onPress={() => {
          restart();
          router.replace('/(tabs)/entries');
        }}
      />
      <Divider />

      <SectionHeader label="About Us" />
      <DisclosureRow
        label="Read our Research"
        Icon={DocumentIcon}
        onPress={() => Linking.openURL(RESEARCH_URL)}
      />
      <DisclosureRow
        label="Privacy Policy"
        Icon={ShieldIcon}
        onPress={() => Linking.openURL(PRIVACY_URL)}
      />
      <DisclosureRow
        label="Terms & Conditions"
        Icon={DocumentIcon}
        onPress={() => Linking.openURL(TERMS_URL)}
      />
      <Divider />

      <SectionHeader label="Account" />
      <DisclosureRow
        label="Log Out"
        Icon={ProfileDeleteIcon}
        onPress={() => {
          signOut();
          router.replace('/');
        }}
      />
      <DisclosureRow
        label="Delete Account"
        Icon={ProfileDeleteIcon}
        destructive
        onPress={deleteAccount}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  faq: {
    gap: space.md,
    paddingLeft: space.xl + space.xs,
    paddingBottom: space.md,
  },
  faqItem: {
    gap: space.xs,
  },
  faqQuestion: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.ink,
  },
  faqAnswer: {
    ...t.bodyMuted,
  },
});
