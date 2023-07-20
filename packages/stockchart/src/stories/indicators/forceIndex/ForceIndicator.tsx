import {format} from 'd3-format';
import * as React from 'react';
import {Chart, ChartCanvas} from 'src/core';
import {XAxis, YAxis} from 'src/axes';
import {ema, forceIndex} from 'src/indicators';
import {discontinuousTimeScaleProviderBuilder} from 'src/scales';
import {LineSeries, StraightLine} from 'src';
import {SingleValueTooltip} from 'src/tooltip';
import {withDeviceRatio, withSize} from 'src/utils';
import {IOHLCData, withOHLCData} from '../../data';

interface ChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

class ForceIndicator extends React.Component<ChartProps> {
  private readonly margin = {left: 0, right: 48, top: 8, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const fi = forceIndex()
      .merge((d: any, c: any) => {
        d.fi = c;
      })
      .accessor((d: any) => d.fi);

    const fiEMA13 = ema()
      .id(1)
      .options({windowSize: 13, sourcePath: 'fi'})
      .merge((d: any, c: any) => {
        d.fiEMA13 = c;
      })
      .accessor((d: any) => d.fiEMA13);

    const calculatedData = fiEMA13(fi(initialData));

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(calculatedData);

    const yAccessor = fiEMA13.accessor();
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
        <Chart id={1} yExtents={yAccessor}>
          <XAxis />
          <YAxis tickFormat={format('.2s')} />

          <LineSeries yAccessor={yAccessor} />
          <StraightLine lineDash="ShortDash2" yValue={0} />

          <SingleValueTooltip
            origin={[8, 8]}
            yAccessor={yAccessor}
            yDisplayFormat={format('.4s')}
            yLabel="ForceIndex (13)"
          />
        </Chart>
      </ChartCanvas>
    );
  }
}

export default withOHLCData()(withSize({style: {minHeight: 600}})(withDeviceRatio()(ForceIndicator)));
