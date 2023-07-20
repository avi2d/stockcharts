// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn} from '@storybook/react';
import * as React from 'react';
import {Label, LabelProps} from 'src';
import Annotations from './Annotations';

export default {
  component: Label,
  title: 'Features/Annotations',
  argTypes: {
    fillStyle: {control: 'color'},
    text: {
      control: {
        type: 'text',
      },
    },
  },
};

const Template: StoryFn<LabelProps> = args => <Annotations {...args} />;

export const background = Template.bind({});
