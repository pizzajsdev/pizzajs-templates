import js from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  { files: ['**/*.{ts,tsx}'], plugins: { js }, extends: ['js/recommended'], ignores: ['app/generated/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    ignores: ['app/generated/**'],
  },
  tseslint.configs.base,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['app/generated/**'],
    rules: {
      'react-hooks/react-compiler': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['app/generated/**'],
    languageOptions: {
      globals: { React: true },
    },
    rules: {
      'no-undef': 'off',
      'no-empty-pattern': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      // TODO: enable later:
      'react-hooks/exhaustive-deps': 'off',
    },
  },
])
