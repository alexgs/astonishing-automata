/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs['flat/prettier'],
	pluginImport.flatConfigs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			ecmaVersion: 'latest',
      parser: tsParser,
			sourceType: 'module',
		},
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['$lib', './src/lib'],
          ],
          extensions: ['.js', '.ts', '.svelte'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
		rules: {
      // Organize imports
			'import/order': [
				'error',
				{
					alphabetize: {
						order: 'asc',
					},
					groups: [
						['builtin', 'external'],
						'internal',
						'parent',
						['index', 'sibling'],
					],
					'newlines-between': 'always',
				},
			],
      // Warn if trying to import a non-existent file or symbol
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/export': 'error',

      // Avoid false positives with ESM packages
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',

      // Optional; helpful to prevent deeply nested relative paths
      'import/no-relative-parent-imports': 'warn',

      // Option; no extraneous deps
      'import/no-extraneous-dependencies': 'error',
    },
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
	},
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte: svelte,
    },
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        // No parser field here!
      },
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['$lib', './src/lib']],
          extensions: ['.js', '.ts', '.svelte'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/default': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-duplicates': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['**/*.config.{js,ts}', 'vite.config.{js,ts}', 'svelte.config.{js,ts}', 'eslint.config.{js,ts}'],
    rules: {
      // Turn off noisy rules just for config files
      'import/default': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-duplicates': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-relative-parent-imports': 'off',
      'import/no-unresolved': 'off',
      'import/order': 'off',
    },
  },
);
