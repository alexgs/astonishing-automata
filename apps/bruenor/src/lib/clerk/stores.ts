/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { UserResource, SessionResource } from '@clerk/types';
import { writable } from 'svelte/store';

export const userStore = writable<UserResource | null>(null);
export const sessionStore = writable<SessionResource | null>(null);
