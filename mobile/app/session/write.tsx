import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { CloseIcon } from '../../src/icons';
import { promptForDay } from '../../src/prompts';
import { useEntries, wordCount, type EntryStyle } from '../../src/store/entries';
import { color, font, radius, space, text, type as t } from '../../src/theme';

/** m22_writing>free-form and m23_writing>guided. */
export default function WriteScreen() {
  const router = useRouter();
  const { style } = useLocalSearchParams<{ style?: EntryStyle }>();
  const entryStyle: EntryStyle = style === 'guided' ? 'guided' : 'free-form';
  const prompt = entryStyle === 'guided' ? promptForDay() : undefined;

  const { addTextEntry } = useEntries();
  const [body, setBody] = useState('');
  const words = wordCount(body);

  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen contentStyle={styles.layout}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close composer"
          style={styles.close}
        >
          <CloseIcon size={24} color={color.ink} />
        </Pressable>

        <View style={styles.head}>
          <Text style={styles.kicker}>{entryStyle === 'guided' ? 'Guided' : 'Free-form'}</Text>
          {prompt ? <Text style={styles.prompt}>{prompt}</Text> : null}
        </View>

        <TextInput
          value={body}
          onChangeText={setBody}
          multiline
          autoFocus
          placeholder={prompt ? 'Start with the first thing that comes up.' : 'Speak your mind, in writing.'}
          placeholderTextColor={color.inkMuted}
          accessibilityLabel="Journal entry text"
          style={styles.input}
        />

        <View style={styles.footer}>
          <Text style={styles.count}>
            {words} {words === 1 ? 'word' : 'words'}
          </Text>
          <PrimaryButton
            label="Save entry"
            disabled={words === 0}
            onPress={() => {
              addTextEntry({ body: body.trim(), style: entryStyle, prompt });
              router.replace('/(tabs)/entries');
            }}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: color.canvas,
  },
  layout: {
    flex: 1,
  },
  close: {
    alignSelf: 'flex-end',
  },
  head: {
    gap: space.sm,
    marginBottom: space.lg,
  },
  kicker: {
    ...t.caption,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  prompt: {
    fontFamily: font.semibold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: color.ink,
  },
  input: {
    flex: 1,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.lg,
    fontFamily: font.body,
    fontSize: text.lead,
    lineHeight: 28,
    color: color.ink,
    textAlignVertical: 'top',
  },
  footer: {
    gap: space.md,
    paddingTop: space.lg,
  },
  count: {
    ...t.caption,
    textAlign: 'right',
  },
});
