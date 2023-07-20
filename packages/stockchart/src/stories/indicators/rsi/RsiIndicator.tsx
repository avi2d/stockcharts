import * as React from 'react';
import {Chart, ChartCanvas} from 'src/core';
import {XAxis, YAxis} from 'src/axes';
import {rsi} from 'src/indicators';
import {discontinuousTimeScaleProviderBuilder} from 'src/scales';
import {RSISeries} from 'src';
import {RSITooltip} from 'src/tooltip';
import {withDeviceRatio, withSize} from 'src/utils';
import {IOHLCData, withOHLCData} from '../../data';

interface ChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

class RSIIndicator extends React.Component<ChartProps> {
  private readonly margin = {left: 0, right: 40, top: 0, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  private readonly rsiCalculator = rsi()
    .options({windowSize: 14})
    .merge((d: any, c: any) => {
      d.rsi = c;
    })
    .accessor((d: any) => d.rsi);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const calculatedData = this.rsiCalculator(initialData);

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max];

    const yAccessor = this.rsiCalculator.accessor();

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
        <Chart id={1} yExtents={[0, 100]}>
          <XAxis />
          <YAxis tickValues={[30, 50, 70]} />

          <RSISeries yAccessor={yAccessor} />

          <RSITooltip options={this.rsiCalculator.options()} origin={[8, 16]} yAccessor={yAccessor} />
        </Chart>
      </ChartCanvas>
    );
  }
}

export default withOHLCData()(withSize({style: {minHeight: 600}})(withDeviceRatio()(RSIIndicator)));
