module.exports = {
  extends: 'marudor',
  env: {
    browser: true,
    node: true,
  },
  globals: {
    SENTRY_DSN: false,
  },
  plugins: [],
  rules: {
    'no-mixed-operators': 0,
    'no-undef': 0,
  },
};
