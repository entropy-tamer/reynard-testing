module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // i18n specific rules
    'no-hardcoded-strings': 'off', // Custom rule would go here
    'prefer-i18n-keys': 'off', // Custom rule would go here
    
    // Standard rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.d.ts',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ],
};
