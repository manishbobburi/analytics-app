module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', 'node_modules', 'vite.config.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
    ]
  },
  overrides: [
    {
      files: ['packages/sdk/**/*.ts'],
      env: { browser: true, es2022: true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      },
      globals: {
        window: 'readonly',
        document: 'readonly'
      }
    },
    {
      files: ['packages/api/**/*.ts'],
      env: { node: true, es2022: true }
    }
  ]
};