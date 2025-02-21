import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: [
      '**/*.config.js',
      '**/__generated__/**',
      '.expo/types/**'
    ]
  },
  {
    files: ['**/*.config.js'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        JSX: true,
      },
      parserOptions: {
        project: './tsconfig.json'
      }
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: '18.3.1',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
      'react/self-closing-comp': 'off',
      'react/no-unknown-property': ['error', { ignore: ['css'] }]
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off' 
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
      import: pluginImport,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': [
        'error',
        {
          usePrettierrc: true,
          fileInfoOptions: {
            withNodeModules: false,
          },
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
      '@typescript-eslint/dot-notation': 'off'
    },
  },
  {
    rules: {
      'react/jsx-indent': 'off',
      'react/jsx-wrap-multilines': 'off',
      'arrow-body-style': 'off',
      'indent': 'off',
      'quotes': 'off',
      'react/jsx-key': 'warn',
      'react/jsx-no-target-blank': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_'
        },
      ],
    },
  },
];