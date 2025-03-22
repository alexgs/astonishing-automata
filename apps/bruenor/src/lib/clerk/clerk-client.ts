/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { UserResource } from '@clerk/types';
import { derived } from 'svelte/store';

import { clerk } from './clerk-instance';
import { userStore } from './clerk-store';

export const clerkUser = derived(userStore, ($user) => $user);

/**
 * Initializes the Clerk user listener and populates the user store.
 * This should be called once on app startup (e.g. from layout).
 */
export function initializeClerkReactivity() {
  // Set the initial user if already available
  if (clerk.user) {
    userStore.set(clerk.user);
  }

  // Subscribe to changes in Clerk resources
  clerk.addListener((resources: { user?: UserResource | null }) => {
    userStore.set(resources.user ?? null);
  });
}

/**
 * Opens Clerk's sign-in modal.
 */
export async function signIn() {
  clerk.openSignIn();
}

/**
 * Signs out the current user via Clerk.
 */
export async function signOut() {
  await clerk.signOut();
}
