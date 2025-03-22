/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { writable, type Writable } from 'svelte/store';
import type { UserResource } from '@clerk/types';

export const userStore: Writable<UserResource | null> = writable(null);
