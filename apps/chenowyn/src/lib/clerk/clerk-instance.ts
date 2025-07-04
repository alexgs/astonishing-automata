/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Clerk } from '@clerk/clerk-js';

import { config } from '$lib/config';

export const clerk = new Clerk(config.clerkPublishableKey);
await clerk.load();
window.Clerk = clerk;
