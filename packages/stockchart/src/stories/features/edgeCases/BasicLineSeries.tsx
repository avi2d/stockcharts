import * as React from 'react';
import {
  Chart,
  ChartCanvas,
  XAxis,
  YAxis,
  discontinuousTimeScaleProviderBuilder,
  LineSeries,
  withDeviceRatio,
  withSize,
} from 'src';
import {IOHLCData} from '../../data';

interface ChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

class BasicLineSeries extends React.Component<ChartProps> {
  private readonly margin = {left: 0, right: 40, top: 0, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(initialData);

    return (
      <ChartCanvas
        data={data}
        displayXAccessor={displayXAccessor}
        height={height}
        margin={this.margin}
        minPointsPerPxThreshold={0.0025}
        ratio={ratio}
        seriesName="Data"
        width={width}
        xAccessor={xAccessor}
        xScale={xScale}
      >
        <Chart id={1} yExtents={this.yExtents}>
          <LineSeries strokeWidth={3} yAccessor={this.yAccessor} />
          <XAxis />
          <YAxis />
        </Chart>
      </ChartCanvas>
    );
  }

  private readonly yAccessor = (data: IOHLCData) => {
    return data.close;
  };

  private readonly yExtents = (data: IOHLCData) => {
    return [data.low, data.high];
  };
}

export default withSize({style: {minHeight: 600}})(withDeviceRatio()(BasicLineSeries));
