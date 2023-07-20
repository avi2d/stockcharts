import * as React from 'react';
import {MouseCoordinateY} from 'src/coordinates';
import Coordinates from './Coordinates';

export default {
  component: MouseCoordinateY,
  title: 'Features/Coordinates',
};

export const edge = () => <Coordinates />;

export const arrows = () => <Coordinates arrowWidth={10} />;