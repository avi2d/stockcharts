const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate');

/** @type {import('stylelint').Config} */
module.exports = {
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-order': [sortOrderSmacss({emptyLineBefore: 'always'})],
  },
  overrides: [
    {
      files: ['**/*.{js,ts,tsx}'],
      customSyntax: '@stylelint/postcss-css-in-js',
    },
  ],
};
