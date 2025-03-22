/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { clerkUser, initializeClerkReactivity, signIn, signOut } from './clerk-client';
import { provideClerkStore } from './clerk-context';
import { userStore } from './clerk-store';

export const auth = {
  init: initializeClerkReactivity,
  provideStore: provideClerkStore,
  signIn,
  signOut,
  user: clerkUser,
  userStore,
};
