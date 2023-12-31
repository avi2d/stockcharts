// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn} from '@storybook/react';
import * as React from 'react';
import {YAxis, YAxisProps} from 'src';
import AxisExample from './Axis';

export default {
  component: YAxis,
  title: 'Features/Axis',
  argTypes: {
    axisAt: {
      control: {
        type: 'select',
        options: ['left', 'right', 'middle'],
      },
    },
    gridLinesStrokeStyle: {control: 'color'},
    strokeStyle: {control: 'color'},
    tickLabelFill: {control: 'color'},
    tickStrokeStyle: {control: 'color'},
  },
};

const Template: StoryFn<YAxisProps> = args => <AxisExample {...args} />;

export const yAxis = Template.bind({});
