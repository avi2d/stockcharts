// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn} from '@storybook/react';
import * as React from 'react';
import {AlternatingFillAreaSeries, AlternatingFillAreaSeriesProps} from 'src';
import {Daily, Intraday} from './BasicBaselineSeries';

export default {
  component: AlternatingFillAreaSeries,
  title: 'Visualization/Series/Baseline',
  args: {
    fillStyle: undefined,
    strokeStyle: undefined,
  },
  argTypes: {
    baseAt: {control: 'number'},
    fillStyle: {control: 'object'},
    strokeStyle: {control: 'object'},
  },
};

const Template: StoryFn<AlternatingFillAreaSeriesProps> = args => <Daily {...args} />;

export const daily = Template.bind({});

const IntradayTemplate: StoryFn<AlternatingFillAreaSeriesProps> = args => <Intraday {...args} />;

export const intraday = IntradayTemplate.bind({});
