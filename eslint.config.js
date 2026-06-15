import { createRequire } from 'node:module';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import eslint from '@eslint/js';

const { browser } = createRequire(import.meta.url)('globals');

export default defineConfig(
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,js,mjs}'],
		plugins: {
			'style': stylistic,
		},
		rules: {
			'dot-notation': 'error',
			'no-new-wrappers': 'error',
			'no-throw-literal': 'error',
			'no-constant-condition': ['error', { checkLoops: false }],
			'unicode-bom': ['error', 'never'],

			'style/indent': ['warn', 'tab', { SwitchCase: 1, ignoredNodes: ['ConditionalExpression'] }],
			'style/quotes': ['warn', 'single'],
			'style/semi': 'warn',
			'style/eol-last': 'error',
			'style/no-trailing-spaces': 'warn',
			'style/no-tabs': ['warn', { allowIndentationTabs: true }],

			'eqeqeq': ['warn', 'always'],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { vars: 'local', args: 'none', varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
			'@typescript-eslint/no-shadow': ['warn', { hoist: 'all' }],
			'style/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		},
		languageOptions: { globals: { ...browser } },
	},
);
