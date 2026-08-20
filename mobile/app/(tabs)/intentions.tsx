import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { FormField } from '../../src/components/FormField';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Screen } from '../../src/components/Screen';
import { ScreenTitle } from '../../src/components/ScreenTitle';
import { useIntentions, type Intention } from '../../src/store/intentions';
import { color, font, space, text, type as t } from '../../src/theme';

/**
 * m6_tutorial>listofintentions1 / m7...2.
 *
 * m6 was the coach mark, m7 the screen. Each card carried an "Edit" label with
 * nothing behind it; here Edit expands the card into its own fields.
 */
export default function IntentionsScreen() {
  const { intentions, addIntention, updateIntention, removeIntention } = useIntentions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: '', detail: '' });
  const [composing, setComposing] = useState(false);

  const beginEdit = (intention: Intention) => {
    setComposing(false);
    setEditingId(intention.id);
    setDraft({ title: intention.title, detail: intention.detail });
  };

  const commitEdit = () => {
    if (!editingId) return;
    updateIntention(editingId, { title: draft.title.trim(), detail: draft.detail.trim() });
    setEditingId(null);
  };

  return (
    <Screen scroll padBottomForTabBar>
      <ScreenTitle>List of Intentions</ScreenTitle>

      {intentions.map((intention) =>
        editingId === intention.id ? (
          <Card key={intention.id} style={styles.card}>
            <FormField label="Intention" value={draft.title} onChangeText={(title) => setDraft((d) => ({ ...d, title }))} />
            <FormField
              label="How it looks in practice"
              value={draft.detail}
              onChangeText={(detail) => setDraft((d) => ({ ...d, detail }))}
              multiline
            />
            <View style={styles.editActions}>
              <Pressable onPress={() => removeIntention(intention.id)} hitSlop={8} accessibilityRole="button">
                <Text style={styles.destructive}>Delete</Text>
              </Pressable>
              <Pressable onPress={commitEdit} hitSlop={8} accessibilityRole="button">
                <Text style={styles.action}>Done</Text>
              </Pressable>
            </View>
          </Card>
        ) : (
          <Card key={intention.id} style={styles.card}>
            <Text style={styles.title}>{intention.title}</Text>
            <Text style={styles.detail}>{intention.detail}</Text>
            <Pressable
              onPress={() => beginEdit(intention)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Edit intention: ${intention.title}`}
              style={styles.editAnchor}
            >
              <Text style={styles.action}>Edit</Text>
            </Pressable>
          </Card>
        ),
      )}

      {composing ? (
        <Card style={styles.card}>
          <FormField
            label="Intention"
            value={draft.title}
            onChangeText={(title) => setDraft((d) => ({ ...d, title }))}
            placeholder="Stay present in conversations"
            autoFocus
          />
          <FormField
            label="How it looks in practice"
            value={draft.detail}
            onChangeText={(detail) => setDraft((d) => ({ ...d, detail }))}
            placeholder="Put the phone face down when someone is talking to me."
            multiline
          />
          <View style={styles.editActions}>
            <Pressable onPress={() => setComposing(false)} hitSlop={8} accessibilityRole="button">
              <Text style={styles.muted}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (!draft.title.trim()) return;
                addIntention({ title: draft.title.trim(), detail: draft.detail.trim() });
                setComposing(false);
              }}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.action}>Save</Text>
            </Pressable>
          </View>
        </Card>
      ) : (
        <View style={styles.addWrap}>
          <PrimaryButton
            label="New intention"
            onPress={() => {
              setEditingId(null);
              setDraft({ title: '', detail: '' });
              setComposing(true);
            }}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: space.md,
    paddingVertical: space.lg,
    gap: space.sm,
  },
  title: {
    fontFamily: font.semibold,
    fontSize: text.lead,
    lineHeight: 26,
    color: color.ink,
  },
  detail: {
    ...t.bodyMuted,
  },
  editAnchor: {
    alignSelf: 'flex-end',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.xs,
  },
  action: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.ink,
    textDecorationLine: 'underline',
  },
  muted: {
    ...t.bodyMuted,
  },
  destructive: {
    fontFamily: font.semibold,
    fontSize: text.body,
    lineHeight: 24,
    color: color.danger,
  },
  addWrap: {
    marginTop: space.sm,
  },
});
