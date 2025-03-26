/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import axios from 'axios';
import * as env from 'env-var';

const CLERK_SECRET_KEY = env.get('CLERK_SECRET_KEY').required().asString();
const CLERK_API_URL = 'https://api.clerk.dev/v1';

export async function getTestToken(userId: string): Promise<string> {
  try {
    // Create a session for the test user
    const sessionResponse = await axios.post(
      `${CLERK_API_URL}/sessions`,
      { user_id: userId },
      { headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` } },
    );
    const sessionId = sessionResponse.data.id;

    // Get the session token (JWT)
    const tokenResponse = await axios.post(
      `${CLERK_API_URL}/sessions/${sessionId}/tokens`,
      { expires_in_seconds: 60 },
      { headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` } },
    );

    return tokenResponse.data.jwt;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error getting Clerk test token:',
        error.response?.data || error.message,
      );
    }
    throw error;
  }
}
