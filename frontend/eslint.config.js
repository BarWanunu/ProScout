import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jest from 'eslint-plugin-jest';          

export default [
  /* 1.  Ignore build artefacts */
  { ignores: ['dist', 'coverage'] },

  /* 2.  Base rules for every JS / JSX file */
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  /* 3.  **Override for Jest test files**  */
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    plugins: { jest },                         // registers eslint-plugin-jest
    languageOptions: {
      globals: jest.environments.globals,      // adds test/expect/jest globals
    },
    rules: {
      ...jest.configs.recommended.rules,       // sensible defaults from the plugin
    },
  },
];
