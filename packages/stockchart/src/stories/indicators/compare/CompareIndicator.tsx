import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';
import * as React from 'react';
import {
  Chart,
  ChartCanvas,
  CrossHairCursor,
  discontinuousTimeScaleProviderBuilder,
  compare,
  LineSeries,
  MouseCoordinateX,
  MouseCoordinateY,
  EdgeIndicator,
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
  readonly width: number;
  readonly ratio: number;
}

class CompareIndicator extends React.Component<ChartProps> {
  private readonly percentFormat = format('.0%');

  private readonly timeDisplayFormat = timeFormat('%d %b');

  private readonly margin = {left: 0, right: 40, top: 8, bottom: 24};

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  public render() {
    const {data: initialData, height, ratio, width} = this.props;

    const compareCalculator = compare()
      .options({
        basePath: 'close',
        mainKeys: ['open', 'high', 'low', 'close'],
        compareKeys: ['AAPLClose', 'SP500Close', 'GEClose'],
      })
      .accessor((d: any) => d.compare)
      .merge((d: any, c: any) => {
        d.compare = c;
      });

    const {data, xScale, xAccessor, displayXAccessor} = this.xScaleProvider(initialData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max];

    return (
      <ChartCanvas
        data={data}
        displayXAccessor={displayXAccessor}
        height={height}
        margin={this.margin}
        postCalculator={compareCalculator}
        ratio={ratio}
        seriesName="Data"
        width={width}
        xAccessor={xAccessor}
        xExtents={xExtents}
        xScale={xScale}
      >
        <Chart id={1} yExtents={this.yExtents}>
          <XAxis />
          <YAxis tickFormat={this.percentFormat} />
          <MouseCoordinateX displayFormat={this.timeDisplayFormat} />
          <MouseCoordinateY displayFormat={this.percentFormat} rectWidth={this.margin.right} />

          <LineSeries strokeStyle="#ff7f0e" yAccessor={d => d.compare.AAPLClose} />
          <LineSeries strokeStyle="#2ca02c" yAccessor={d => d.compare.SP500Close} />
          <LineSeries strokeStyle="#2196f3" yAccessor={d => d.compare.GEClose} />

          <EdgeIndicator
            displayFormat={this.percentFormat}
            edgeAt="right"
            fill="#ff7f0e"
            itemType="last"
            lineStroke="#ff7f0e"
            orient="right"
            yAccessor={d => d.compare.AAPLClose}
          />
          <EdgeIndicator
            displayFormat={this.percentFormat}
            edgeAt="right"
            fill="#2ca02c"
            itemType="last"
            lineStroke="#2ca02c"
            orient="right"
            yAccessor={d => d.compare.SP500Close}
          />
          <EdgeIndicator
            displayFormat={this.percentFormat}
            edgeAt="right"
            fill="#2196f3"
            itemType="last"
            lineStroke="#2196f3"
            orient="right"
            yAccessor={d => d.compare.GEClose}
          />

          <SingleValueTooltip
            origin={[8, 16]}
            valueFill="#ff7f0e"
            yAccessor={d => d.AAPLClose}
            yDisplayFormat={format('.2f')}
            yLabel="AAPL"
          />
          <SingleValueTooltip
            origin={[8, 32]}
            valueFill="#2ca02c"
            yAccessor={d => d.SP500Close}
            yDisplayFormat={format('.2f')}
            yLabel="S&P 500"
          />
          <SingleValueTooltip origin={[8, 48]} yAccessor={d => d.GEClose} yDisplayFormat={format('.2f')} yLabel="GE" />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }

  private readonly yExtents = (data: any) => {
    return data.compare;
  };
}

export default withOHLCData('comparison')(withSize({style: {minHeight: 600}})(withDeviceRatio()(CompareIndicator)));
