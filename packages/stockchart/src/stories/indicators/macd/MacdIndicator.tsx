import * as React from 'react';
import {Chart, ChartCanvas} from 'src/core';
import {XAxis, YAxis} from 'src/axes';
import {macd} from 'src/indicators';
import {discontinuousTimeScaleProviderBuilder} from 'src/scales';
import {MACDSeries} from 'src';
import {MACDTooltip} from 'src/tooltip';
import {withDeviceRatio, withSize} from 'src/utils';
import {IOHLCData, withOHLCData} from '../../data';

interface ChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

class MACDIndicator extends React.Component<ChartProps> {
  private readonly macdAppearance = {
    fillStyle: {
      divergence: '#4682B4',
    },
    strokeStyle: {
      macd: '#0093FF',
      signal: '#D84315',
      zero: 'rgba(0, 0, 0, 0.3)',
    },
  };

  private readonly margin = {left: 0, right: 40, top: 0, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  private readonly macdCalculator = macd()
    .options({
      fast: 12,
      signal: 9,
      slow: 26,
    })
    .merge((d: any, c: any) => {
      d.macd = c;
    })
    .accessor((d: any) => d.macd);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const calculatedData = this.macdCalculator(initialData);

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max];

    const yAccessor = this.macdCalculator.accessor();
    const options = this.macdCalculator.options();

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

          <MACDSeries yAccessor={yAccessor} {...this.macdAppearance} />

          <MACDTooltip appearance={this.macdAppearance} options={options} origin={[8, 16]} yAccessor={yAccessor} />
        </Chart>
      </ChartCanvas>
    );
  }
}

export default withOHLCData()(withSize({style: {minHeight: 600}})(withDeviceRatio()(MACDIndicator)));
