import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { usePersistentState } from './persist';

export type Profile = {
  name: string;
  email: string;
  /** Epoch ms, stamped the first time the app runs. */
  joinedAt: number;
  /** Local file URI for a chosen picture, or null for the initial-letter disc. */
  avatarUri: string | null;
  notificationsEnabled: boolean;
};

const STORAGE_KEY = 'reself.profile.v1';

const DEFAULT_PROFILE: Profile = {
  name: '',
  email: '',
  joinedAt: 0,
  avatarUri: null,
  notificationsEnabled: true,
};

type ProfileApi = {
  profile: Profile;
  hydrated: boolean;
  /** Uppercase first letter for the avatar disc; '?' when the name is empty. */
  initial: string;
  joinedLabel: string;
  updateProfile: (patch: Partial<Profile>) => void;
  signOut: () => void;
};

const ProfileContext = createContext<ProfileApi | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { value, setValue, hydrated } = usePersistentState<Profile>(STORAGE_KEY, DEFAULT_PROFILE);

  const updateProfile = useCallback<ProfileApi['updateProfile']>(
    (patch) => setValue((prev) => ({ ...prev, ...patch })),
    [setValue],
  );

  const signOut = useCallback(() => setValue(DEFAULT_PROFILE), [setValue]);

  const initial = value.name.trim().charAt(0).toUpperCase() || '?';

  const joinedLabel = useMemo(() => {
    if (!value.joinedAt) return '';
    const d = new Date(value.joinedAt);
    return `Joined on ${d.toLocaleString('en-US', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`;
  }, [value.joinedAt]);

  const api = useMemo<ProfileApi>(
    () => ({ profile: value, hydrated, initial, joinedLabel, updateProfile, signOut }),
    [value, hydrated, initial, joinedLabel, updateProfile, signOut],
  );

  return <ProfileContext.Provider value={api}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
