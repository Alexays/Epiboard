module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    browser: true,
    CardsObj: true,
    Langs: true,
    browserName: true,
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 0,
    'no-bitwise': 0,
    'no-underscore-dangle': 0,
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
        'f',
      ],
    }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
