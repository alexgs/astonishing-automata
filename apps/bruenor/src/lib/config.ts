/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { z } from 'zod';

// eslint-disable-next-line import/no-unresolved
import * as env from '$env/static/public';

const envSchema = z.object({
  PUBLIC_API_HOST: z.string(),
  PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
});

const parsed = envSchema.safeParse(env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Environment variable validation failed');
}

export const config = {
  apiHost: parsed.data.PUBLIC_API_HOST,
  clerkPublishableKey: parsed.data.PUBLIC_CLERK_PUBLISHABLE_KEY,
};
