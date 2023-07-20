import * as React from 'react';
import {PointAndFigureSeries} from 'src';
import {Daily} from './BasicPointAndFigureSeries';

export default {
  component: PointAndFigureSeries,
  title: 'Visualization/Series/Point & Figure',
};

export const daily = () => <Daily />;
