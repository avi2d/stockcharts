// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn} from '@storybook/react';
import * as React from 'react';
import {BarSeries, BarSeriesProps} from 'src';
import {Daily, Intraday} from './BasicBarSeries';

export default {
  component: BarSeries,
  title: 'Visualization/Series/Bar',
  argTypes: {
    fillStyle: {control: 'color'},
  },
};

const Template: StoryFn<BarSeriesProps> = args => <Daily {...args} />;

export const daily = Template.bind({});

const IntradayTemplate: StoryFn<BarSeriesProps> = args => <Intraday {...args} />;

export const intraday = IntradayTemplate.bind({});
