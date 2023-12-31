// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn} from '@storybook/react';
import * as React from 'react';
import {AreaSeries, AreaSeriesProps} from 'src';
import {Daily, Intraday} from './BasicAreaSeries';

export default {
  title: 'Visualization/Series/Area',
  component: AreaSeries,
  argTypes: {
    fillStyle: {control: 'color'},
    strokeStyle: {control: 'color'},
  },
};

const Template: StoryFn<AreaSeriesProps> = args => <Daily {...args} />;

export const daily = Template.bind({});

const IntradayTemplate: StoryFn<AreaSeriesProps> = args => <Intraday {...args} />;

export const intraday = IntradayTemplate.bind({});
