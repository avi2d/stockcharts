import {StorybookConfig} from '@storybook/react-webpack5';
import webpack from 'webpack';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !prop.parent.fileName.includes('@types/react') : true),
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@ergosign/storybook-addon-pseudo-states-react/preset-postcss',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    'storycap',
  ],
  babel: async options => ({
    ...options,
    plugins: [
      ...options.plugins, //
      'babel-plugin-storybook-addon-pseudo-states-emotion',
    ],
  }),
  webpackFinal: async config => {
    // @emotion/server
    config.resolve.fallback = {...config.resolve.fallback, stream: false, buffer: false};
    config.plugins = [
      ...config.plugins.filter(plugin => {
        return plugin.constructor.name !== 'ESLintWebpackPlugin';
      }),
      // new webpack.ProvidePlugin({
      //   Buffer: ['buffer', 'Buffer'],
      // }),
    ];

    return config;
  },
  docs: {
    autodocs: true,
  },
};

export default config;
