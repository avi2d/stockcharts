const path = require('path');
const ignore = require('../../node_modules/@tools/linters/eslint/ignore');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
  },

  extends: [path.resolve(__dirname, '../../node_modules/@tools/linters/eslint')],
  ignorePatterns: ['scripts', ...ignore.configs, ...ignore.artifacts],
};
