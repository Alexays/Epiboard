module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    browser: true,
    Cards: true,
    browserName: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-bitwise': 0,
    'no-underscore-dangle': 0,
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
        'f'
      ]
    }],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
