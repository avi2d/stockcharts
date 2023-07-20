import '@fontsource/nunito-sans';

import {Global} from '@emotion/react';
import {Preview} from '@storybook/react';
import React from 'react';

const withThemeProvider: Preview['decorators'][0] = (Story, context) => {

  return (
    <>
      <Global
        styles={`
          body {
           font-family: 'Nunito Sans';
          }
        `}
      />
      <div style={{display: 'inline-block'}}>
        <Story  />
      </div>
    </>
  );
};

export const decorators = [withThemeProvider];
