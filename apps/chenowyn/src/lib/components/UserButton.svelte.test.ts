/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { UserResource } from '@clerk/types';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { describe, test, expect, vi } from 'vitest';

import { auth } from '$lib/clerk';

import UserButton from './UserButton.svelte';

vi.mock('$lib/clerk', () => ({
  auth: {
    clerk: {
      signOut: vi.fn(),
      openSignIn: vi.fn(),
    },
    user: null,
  },
}));

const mockUser: UserResource = {
  imageUrl: 'https://example.com/profile.jpg',
} as UserResource;

describe('UserButton Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the sign-in icon when user is not signed in', () => {
    render(UserButton);
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  test('renders the user image when user is signed in', () => {
    auth.user = readable(mockUser);
    render(UserButton);
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  test('calls signOut when user is signed in and button is clicked', async () => {
    auth.user = readable(mockUser);
    render(UserButton);
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    expect(auth.clerk.signOut).toHaveBeenCalled();
  });

  test('calls openSignIn when user is not signed in and button is clicked', async () => {
    auth.user = readable(null);
    render(UserButton);
    const button = screen.getByRole('button');
    await fireEvent.click(button);
    expect(auth.clerk.openSignIn).toHaveBeenCalled();
  });
});
