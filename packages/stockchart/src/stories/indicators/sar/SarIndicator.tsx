import * as React from 'react';
import {Chart, ChartCanvas} from 'src/core';
import {XAxis, YAxis} from 'src/axes';
import {sar} from 'src/indicators';
import {discontinuousTimeScaleProviderBuilder} from 'src/scales';
import {SARSeries} from 'src';
import {SingleValueTooltip} from 'src/tooltip';
import {withDeviceRatio, withSize} from 'src/utils';
import {IOHLCData, withOHLCData} from '../../data';

interface ChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

class SARIndicator extends React.Component<ChartProps> {
  private readonly accelerationFactor = 0.02;

  private readonly maxAccelerationFactor = 0.2;

  private readonly margin = {left: 0, right: 40, top: 8, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  private readonly sarCalculator = sar()
    .options({
      accelerationFactor: this.accelerationFactor,
      maxAccelerationFactor: this.maxAccelerationFactor,
    })
    .merge((d: any, c: any) => {
      d.sar = c;
    })
    .accessor((d: any) => d.sar);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const calculatedData = this.sarCalculator(initialData);

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max];

    const yAccessor = this.sarCalculator.accessor();

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
        <Chart id={1} yExtents={yAccessor}>
          <XAxis />
          <YAxis />

          <SARSeries yAccessor={yAccessor} />

          <SingleValueTooltip
            origin={[8, 8]}
            yAccessor={yAccessor}
            yLabel={`SAR (${this.accelerationFactor}, ${this.maxAccelerationFactor})`}
          />
        </Chart>
      </ChartCanvas>
    );
  }
}

export default withOHLCData()(withSize({style: {minHeight: 600}})(withDeviceRatio()(SARIndicator)));
