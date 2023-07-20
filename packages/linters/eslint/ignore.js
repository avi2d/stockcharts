module.exports = {
  artifacts: [
    //
    'dist',
    'storybook-static',
    'coverage',
    'coverage-ts',
    'coverage-changed',
    'jest-html-reporters-attach',
    'bundle-report',
  ],
  configs: [
    //
    '.eslintrc.js',
    'svgo.config.js',
    'svgo.config.manual.js',
    'lint-staged.config.js',
    'next.config.js',
    'next-sitemap.config.js',
    'next-security.config.js',
    'prettier.config.js',
    'statoscope.config.js',
    'jest.config.js',
  ],
  nextjs: [
    //
    '.next',
    'public',
  ],
};
