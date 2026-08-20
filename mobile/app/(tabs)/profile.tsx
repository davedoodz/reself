import { Directory, File, Paths } from 'expo-file-system';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../../src/components/Avatar';
import { FormField, StaticField } from '../../src/components/FormField';
import { Screen } from '../../src/components/Screen';
import { ScreenTitle } from '../../src/components/ScreenTitle';
import { useEntries } from '../../src/store/entries';
import { useProfile } from '../../src/store/profile';
import { color, font, space, text, type as t } from '../../src/theme';

/**
 * m12_tutorial>profile1 / m13...profile2.
 *
 * m12 was the coach mark over an empty canvas; m13 the screen. "Change Picture"
 * had no behaviour in the file — it is wired to the OS picker here.
 */
export default function ProfileScreen() {
  const { profile, initial, joinedLabel, updateProfile } = useProfile();
  const { entries } = useEntries();

  const voiceCount = entries.filter((e) => e.mode === 'talking').length;
  const writtenCount = entries.length - voiceCount;

  return (
    <Screen scroll padBottomForTabBar>
      <ScreenTitle>Profile</ScreenTitle>

      <View style={styles.avatarBlock}>
        <Avatar initial={initial} uri={profile.avatarUri} />
        <Pressable
          onPress={() => pickAvatar(updateProfile)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Change profile picture"
        >
          <Text style={styles.changePicture}>Change Picture</Text>
        </Pressable>
      </View>

      <FormField
        label="Name"
        value={profile.name}
        onChangeText={(name) => updateProfile({ name })}
        placeholder="Your name"
        autoCapitalize="words"
      />
      <FormField
        label="Email"
        value={profile.email}
        onChangeText={(email) => updateProfile({ email })}
        placeholder="you@example.edu"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {joinedLabel ? <StaticField label="Member since" value={joinedLabel} /> : null}

      <View style={styles.stats}>
        <Stat value={voiceCount} label={voiceCount === 1 ? 'spoken entry' : 'spoken entries'} />
        <Stat value={writtenCount} label={writtenCount === 1 ? 'written entry' : 'written entries'} />
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/**
 * Uses the system document picker from expo-file-system rather than adding
 * expo-image-picker for a single call site.
 */
async function pickAvatar(updateProfile: (patch: { avatarUri: string | null }) => void) {
  const picked = await File.pickFileAsync({ mimeTypes: ['image/*'] });
  if (picked.canceled) return;

  // Copy into the app container: the picker URI is a temporary grant that will
  // not resolve on the next launch.
  const avatars = new Directory(Paths.document, 'avatars');
  if (!avatars.exists) avatars.create({ intermediates: true });
  const extension = picked.result.uri.split('.').pop() || 'jpg';
  const target = new File(avatars, `avatar-${Date.now()}.${extension}`);
  picked.result.copy(target);
  updateProfile({ avatarUri: target.uri });
}

const styles = StyleSheet.create({
  avatarBlock: {
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.xl,
  },
  changePicture: {
    fontFamily: font.medium,
    fontSize: text.lead,
    lineHeight: 26,
    color: color.inkMuted,
    textDecorationLine: 'underline',
  },
  stats: {
    flexDirection: 'row',
    gap: space.xl,
    marginTop: space.sm,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontFamily: font.extrabold,
    fontSize: text.title,
    lineHeight: 40,
    color: color.ink,
  },
  statLabel: {
    ...t.caption,
  },
});
