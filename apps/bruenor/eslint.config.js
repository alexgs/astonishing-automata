/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
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
	importPlugin.flatConfigs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			// 'no-unused-vars': 'off',
			// 'import/no-dynamic-require': 'warn',
			// 'import/no-nodejs-modules': 'warn',
      'import/no-unresolved': 'off', // TODO I bet I could turn this on after determining the right resolver to use
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
);
