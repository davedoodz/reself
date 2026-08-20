import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { formatDuration } from '../../src/format';
import { CloseIcon, MicIcon, PauseCircleIcon } from '../../src/icons';
import { promptForDay } from '../../src/prompts';
import { useEntries, type EntryStyle } from '../../src/store/entries';
import { color, font, radius, space, text, type as t } from '../../src/theme';

type Permission = 'checking' | 'granted' | 'denied';

/**
 * m20_talking>free-form and m21_talking>guided.
 *
 * Two artboards differing only by the prompt above the timer, so `style` is a
 * route param rather than a second screen.
 */
export default function TalkScreen() {
  const router = useRouter();
  const { style } = useLocalSearchParams<{ style?: EntryStyle }>();
  const entryStyle: EntryStyle = style === 'guided' ? 'guided' : 'free-form';
  const prompt = entryStyle === 'guided' ? promptForDay() : undefined;

  const { addVoiceEntry } = useEntries();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder, 100);
  const [permission, setPermission] = useState<Permission>('checking');
  const [saving, setSaving] = useState(false);
  const [stoppedUri, setStoppedUri] = useState<string | null>(null);
  const [stoppedMs, setStoppedMs] = useState(0);

  useEffect(() => {
    requestRecordingPermissionsAsync()
      .then(({ granted }) => setPermission(granted ? 'granted' : 'denied'))
      .catch(() => setPermission('denied'));
  }, []);

  const start = useCallback(async () => {
    setStoppedUri(null);
    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [recorder]);

  const stop = useCallback(async () => {
    // Capture the duration before stopping — the state resets on stop.
    const elapsed = state.durationMillis;
    await recorder.stop();
    setStoppedMs(elapsed);
    setStoppedUri(recorder.uri);
  }, [recorder, state.durationMillis]);

  const save = useCallback(async () => {
    if (!stoppedUri || saving) return;
    setSaving(true);
    try {
      await addVoiceEntry({
        sourceUri: stoppedUri,
        durationMs: stoppedMs,
        style: entryStyle,
        prompt,
      });
      router.replace('/(tabs)/entries');
    } finally {
      setSaving(false);
    }
  }, [stoppedUri, stoppedMs, saving, addVoiceEntry, entryStyle, prompt, router]);

  const elapsed = stoppedUri ? stoppedMs : state.durationMillis;

  return (
    <Screen contentStyle={styles.layout}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close recorder"
        style={styles.close}
      >
        <CloseIcon size={24} color={color.ink} />
      </Pressable>

      <View style={styles.head}>
        <Text style={styles.kicker}>{entryStyle === 'guided' ? 'Guided' : 'Free-form'}</Text>
        {prompt ? <Text style={styles.prompt}>{prompt}</Text> : null}
      </View>

      <View style={styles.stage}>
        <View style={[styles.halo, state.isRecording && styles.haloLive]} pointerEvents="none" />
        <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
      </View>

      <View style={styles.controls}>
        {permission === 'checking' ? (
          <Text style={styles.notice}>Checking microphone access…</Text>
        ) : null}
        {permission === 'denied' ? (
          <Text style={styles.notice}>
            Microphone access is off. Enable it in Settings to record a spoken entry.
          </Text>
        ) : null}

        {stoppedUri ? (
          <>
            <PrimaryButton label={saving ? 'Saving…' : 'Save entry'} onPress={save} disabled={saving} />
            <Pressable
              onPress={start}
              hitSlop={8}
              accessibilityRole="button"
              style={styles.centerRow}
            >
              <Text style={styles.secondary}>Record again</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.centerRow}>
            <Pressable
              onPress={state.isRecording ? stop : start}
              disabled={permission !== 'granted'}
              accessibilityRole="button"
              accessibilityLabel={state.isRecording ? 'Stop recording' : 'Start recording'}
              style={({ pressed }) => [
                styles.recordButton,
                state.isRecording && styles.recordButtonLive,
                pressed && styles.pressed,
                permission !== 'granted' && styles.disabled,
              ]}
            >
              {state.isRecording ? (
                <PauseCircleIcon size={40} color={color.ink} />
              ) : (
                <MicIcon size={40} color={color.ink} />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  close: {
    alignSelf: 'flex-end',
  },
  head: {
    gap: space.sm,
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
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.xl,
  },
  halo: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    opacity: 0.25,
  },
  haloLive: {
    opacity: 0.55,
  },
  timer: {
    fontFamily: font.extrabold,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1.5,
    color: color.ink,
    // Tabular-ish stability: the mono variant is not loaded, so a fixed width
    // stops the timer from jittering as digits change.
    minWidth: 180,
    textAlign: 'center',
  },
  controls: {
    // Stretch, not centre: the save button is a full-width pill like every other
    // primary action. The record disc gets its own centred row instead.
    alignSelf: 'stretch',
    gap: space.lg,
  },
  centerRow: {
    alignItems: 'center',
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonLive: {
    backgroundColor: color.brandStrong,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
  secondary: {
    ...t.bodyMuted,
    textDecorationLine: 'underline',
  },
  notice: {
    ...t.bodyMuted,
    textAlign: 'center',
  },
});
