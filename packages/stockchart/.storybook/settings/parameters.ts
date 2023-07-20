import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';
import {Preview} from '@storybook/react';

export const parameters: Preview['parameters'] = {
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'dark',
        value: '#000',
      },
      {
        name: 'light',
        value: '#fff',
      },
    ],
  },
  actions: {argTypesRegex: '^on[A-Z].*'},
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  controls: {
    sort: 'requiredFirst',
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    element: '#root',
    manual: false,
  },
  screenshot: {
    delay: 500,
    viewport: {
      width: 800,
      height: 600,
      deviceScaleFactor: 3,
    },
    // variants: {light: {theme: 'light'}},
  },
};
