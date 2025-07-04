/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { clerk } from './clerk-instance';
import {
  clerkSession,
  clerkUser,
  initializeClerkReactivity,
  signIn,
  signOut,
} from './client';
import { provideClerkStore } from './context';
import { userStore } from './stores';

export const auth = {
  clerk,
  init: initializeClerkReactivity,
  provideStore: provideClerkStore,
  session: clerkSession,
  signIn,
  signOut,
  user: clerkUser,
  userStore,
};
