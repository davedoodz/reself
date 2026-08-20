import { Tabs, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { CoachMark } from '../../src/components/CoachMark';
import { RecorderSheet } from '../../src/components/RecorderSheet';
import { TabBar } from '../../src/components/TabBar';
import { useTutorial } from '../../src/store/tutorial';
import { color } from '../../src/theme';

export default function TabsLayout() {
  const router = useRouter();
  const [recorderOpen, setRecorderOpen] = useState(false);
  const { step, stepIndex, stepCount, advance, skip } = useTutorial();

  const tourActive = step !== null;

  // While the walkthrough is up the tab bar is illustrative, not interactive —
  // the scrim is what advances. Returning true swallows the press.
  const onTabPress = useCallback(() => (tourActive ? true : undefined), [tourActive]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: color.canvas },
        }}
        tabBar={(props) => (
          <TabBar
            {...props}
            recorderOpen={recorderOpen}
            onToggleRecorder={() => setRecorderOpen((open) => !open)}
            onTabPress={onTabPress}
          />
        )}
      >
        <Tabs.Screen name="intentions" options={{ title: 'List of Intentions' }} />
        <Tabs.Screen name="entries" options={{ title: 'Journal Entries' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>

      <RecorderSheet
        visible={recorderOpen && !tourActive}
        onDismiss={() => setRecorderOpen(false)}
        onConfirm={({ mode, style }) => {
          setRecorderOpen(false);
          router.push({
            pathname: mode === 'talking' ? '/session/talk' : '/session/write',
            params: { style },
          });
        }}
      />

      {step ? (
        <CoachMark
          step={step}
          index={stepIndex}
          count={stepCount}
          onAdvance={advance}
          onSkip={skip}
        />
      ) : null}
    </>
  );
}
