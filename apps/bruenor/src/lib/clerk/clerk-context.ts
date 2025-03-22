/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { setContext, getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { UserResource } from '@clerk/types';

const key = Symbol('clerk-user-store');

export function provideClerkStore(store: Writable<UserResource | null>) {
  setContext(key, store);
}

export function useClerkStore(): Writable<UserResource | null> {
  return getContext(key);
}
