import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        customElements: 'readonly',
        CSSStyleSheet: 'readonly',
        CustomEvent: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
      },
    },

    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': ['warn'],
      'no-undef': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  js.configs.recommended,
];
