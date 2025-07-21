const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs', // Node.js classique
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      js,
    },
    rules: {
      // Style & lisibilité
      indent: ['error', 2],
      // quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // Qualité & sécurité
      'no-unused-vars': ['warn'],
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': process.env.NODE_ENV==='production'? 'error':'warn',

      // Bonnes pratiques
      curly: ['error', 'all'],
      'consistent-return': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
    },
  },
]);
