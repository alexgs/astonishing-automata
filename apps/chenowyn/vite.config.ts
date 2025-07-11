/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';

export default defineConfig({
  plugins: [sveltekit(), devtoolsJson()],
  build: {
    target: 'es2022'
  },
  server: {
    allowedHosts: true,
  },

  test: {
    projects: [
      {
        extends: './vite.config.ts',
        plugins: [svelteTesting()],

        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-unit.ts'], // optional
        },
      },
      {
        test: {
          name: 'e2e',
          environment: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
          },
          include: ['e2e/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**'],
          setupFiles: ['./vitest-setup-e2e.ts']
        }
      },
      {
        test: {
          name: 'logic',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
