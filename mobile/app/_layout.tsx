import {
  AfacadFlux_400Regular,
  AfacadFlux_500Medium,
  AfacadFlux_600SemiBold,
  AfacadFlux_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/afacad-flux';
import { setAudioModeAsync } from 'expo-audio';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { EntriesProvider } from '../src/store/entries';
import { IntentionsProvider } from '../src/store/intentions';
import { ProfileProvider } from '../src/store/profile';
import { TutorialProvider } from '../src/store/tutorial';
import { color } from '../src/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    AfacadFlux_400Regular,
    AfacadFlux_500Medium,
    AfacadFlux_600SemiBold,
    AfacadFlux_800ExtraBold,
  });

  useEffect(() => {
    // Recording needs the session configured before the first `record()`, and
    // playback must not drop to the earpiece or be silenced by the ring switch.
    setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'doNotMix',
    }).catch(() => {});
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: color.canvas }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProfileProvider>
          <EntriesProvider>
            <IntentionsProvider>
              <TutorialProvider>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: color.canvas },
                  }}
                />
              </TutorialProvider>
            </IntentionsProvider>
          </EntriesProvider>
        </ProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
