module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    document:false,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser:"babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
  },
};
