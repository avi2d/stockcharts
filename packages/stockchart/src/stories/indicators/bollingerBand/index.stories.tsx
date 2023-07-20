// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn} from '@storybook/react';
import * as React from 'react';
import {BollingerSeries, BollingerSeriesProps} from 'src';
import BollingerIndicator from './BollingerIndicator';

export default {
  title: 'Visualization/Indicator/Bollinger Band',
  component: BollingerSeries,
  argTypes: {
    fillStyle: {control: 'color'},
    strokeStyle: {control: null},
  },
};

const Template: StoryFn<BollingerSeriesProps> = ({fillStyle}) => <BollingerIndicator fillStyle={fillStyle} />;

export const basic = Template.bind({});
