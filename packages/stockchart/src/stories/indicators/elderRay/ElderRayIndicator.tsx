import {format} from 'd3-format';
import * as React from 'react';
import {
  change,
  elderRay,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  ElderRaySeries,
  SingleValueTooltip,
  XAxis,
  YAxis,
  withDeviceRatio,
  withSize,
} from 'src';
import {IOHLCData, withOHLCData} from '../../data';

interface ChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly ratio: number;
  readonly width: number;
}

export class ElderRayIndicatorChart extends React.Component<ChartProps> {
  private readonly margin = {left: 0, right: 48, top: 8, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const elder = elderRay();

    const changeCalculator = change();

    const calculatedData = changeCalculator(elder(initialData));

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max];

    return (
      <ChartCanvas
        data={data}
        displayXAccessor={displayXAccessor}
        height={height}
        margin={this.margin}
        ratio={ratio}
        seriesName="Data"
        width={width}
        xAccessor={xAccessor}
        xExtents={xExtents}
        xScale={xScale}
      >
        <Chart id={1} yExtents={[0, elder.accessor()]}>
          <XAxis />
          <YAxis tickFormat={format('.2f')} ticks={4} />

          <ElderRaySeries yAccessor={elder.accessor()} />

          <SingleValueTooltip
            origin={[8, 8]}
            yAccessor={elder.accessor()}
            yDisplayFormat={(d: any) => `${format('.2f')(d.bullPower)}, ${format('.2f')(d.bearPower)}`}
            yLabel="Elder Ray"
          />
        </Chart>
      </ChartCanvas>
    );
  }
}

export default withOHLCData()(withSize({style: {minHeight: 600}})(withDeviceRatio()(ElderRayIndicatorChart)));
