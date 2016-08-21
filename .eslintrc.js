module.exports = {
  extends: 'marudor',
  env: {
    browser: true,
    node: true,
  },
  globals: {

  },
  plugins: [
    'header',
  ],
  rules: {
    'header/header': [2, 'line', ' @flow'],
  }
}
