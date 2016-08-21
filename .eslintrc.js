module.exports = {
  extends: 'marudor',
  env: {
    browser: true,
    node: true,
  },
  globals: {
    SENTRY_DSN: false,
  },
  plugins: [
    'header',
  ],
  rules: {
    'header/header': [2, 'line', ' @flow'],
  }
}
