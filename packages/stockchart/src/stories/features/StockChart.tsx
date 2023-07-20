import {format} from 'd3-format';
import {timeFormat} from 'd3-time-format';
import * as React from 'react';
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize,
} from 'src';
import {IOHLCData, withOHLCData} from '../data';

interface StockChartProps {
  readonly data: IOHLCData[];
  readonly height: number;
  readonly dateTimeFormat?: string;
  readonly width: number;
  readonly ratio: number;
}

class StockChart extends React.Component<StockChartProps> {
  private readonly margin = {left: 0, right: 48, top: 0, bottom: 24};

  private readonly pricesDisplayFormat = format('.2f');

  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IOHLCData) => d.date);

  public render() {
    const {data: initialData, dateTimeFormat = '%d %b', height, ratio, width} = this.props;

    const ema12 = ema()
      .id(1)
      .options({windowSize: 12})
      .merge((d: any, c: any) => {
        d.ema12 = c;
      })
      .accessor((d: any) => d.ema12);

    const ema26 = ema()
      .id(2)
      .options({windowSize: 26})
      .merge((d: any, c: any) => {
        d.ema26 = c;
      })
      .accessor((d: any) => d.ema26);

    const elder = elderRay();

    const calculatedData = elder(ema26(ema12(initialData)));

    const {margin, xScaleProvider} = this;

    const {data, xScale, xAccessor, displayXAccessor} = xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max + 5];

    const gridHeight = height - margin.top - margin.bottom;

    const elderRayHeight = 100;
    const elderRayOrigin = (_: number, h: number) => [0, h - elderRayHeight];
    const barChartHeight = gridHeight / 4;
    const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight - elderRayHeight];
    const chartHeight = gridHeight - elderRayHeight;

    const timeDisplayFormat = timeFormat(dateTimeFormat);

    return (
      <ChartCanvas
        data={data}
        displayXAccessor={displayXAccessor}
        height={height}
        margin={margin}
        ratio={ratio}
        seriesName="Data"
        width={width}
        xAccessor={xAccessor}
        xExtents={xExtents}
        xScale={xScale}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
      >
        <Chart height={barChartHeight} id={2} origin={barChartOrigin} yExtents={this.barChartExtents}>
          <BarSeries fillStyle={this.volumeColor} yAccessor={this.volumeSeries} />
        </Chart>
        <Chart height={chartHeight} id={3} yExtents={this.candleChartExtents}>
          <XAxis showGridLines showTickLabel={false} showTicks={false} />
          <YAxis showGridLines tickFormat={this.pricesDisplayFormat} />
          <CandlestickSeries />
          <LineSeries strokeStyle={ema26.stroke()} yAccessor={ema26.accessor()} />
          <CurrentCoordinate fillStyle={ema26.stroke()} yAccessor={ema26.accessor()} />
          <LineSeries strokeStyle={ema12.stroke()} yAccessor={ema12.accessor()} />
          <CurrentCoordinate fillStyle={ema12.stroke()} yAccessor={ema12.accessor()} />
          <MouseCoordinateY displayFormat={this.pricesDisplayFormat} rectWidth={margin.right} />
          <EdgeIndicator
            displayFormat={this.pricesDisplayFormat}
            fill={this.openCloseColor}
            itemType="last"
            lineStroke={this.openCloseColor}
            rectWidth={margin.right}
            yAccessor={this.yEdgeIndicator}
          />
          <MovingAverageTooltip
            options={[
              {
                yAccessor: ema26.accessor(),
                type: 'EMA',
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize,
              },
              {
                yAccessor: ema12.accessor(),
                type: 'EMA',
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize,
              },
            ]}
            origin={[8, 24]}
          />

          <ZoomButtons />
          <OHLCTooltip origin={[8, 16]} />
        </Chart>
        <Chart
          height={elderRayHeight}
          id={4}
          origin={elderRayOrigin}
          padding={{top: 8, bottom: 8}}
          yExtents={[0, elder.accessor()]}
        >
          <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
          <YAxis tickFormat={this.pricesDisplayFormat} ticks={4} />

          <MouseCoordinateX displayFormat={timeDisplayFormat} />
          <MouseCoordinateY displayFormat={this.pricesDisplayFormat} rectWidth={margin.right} />

          <ElderRaySeries yAccessor={elder.accessor()} />

          <SingleValueTooltip
            origin={[8, 16]}
            yAccessor={elder.accessor()}
            yDisplayFormat={(d: any) =>
              `${this.pricesDisplayFormat(d.bullPower)}, ${this.pricesDisplayFormat(d.bearPower)}`
            }
            yLabel="Elder Ray"
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }

  private readonly barChartExtents = (data: IOHLCData) => {
    return data.volume;
  };

  private readonly candleChartExtents = (data: IOHLCData) => {
    return [data.high, data.low];
  };

  private readonly yEdgeIndicator = (data: IOHLCData) => {
    return data.close;
  };

  private readonly volumeColor = (data: IOHLCData) => {
    return data.close > data.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)';
  };

  private readonly volumeSeries = (data: IOHLCData) => {
    return data.volume;
  };

  private readonly openCloseColor = (data: IOHLCData) => {
    return data.close > data.open ? '#26a69a' : '#ef5350';
  };
}

export default withOHLCData()(withSize({style: {minHeight: 600}})(withDeviceRatio()(StockChart)));

export const MinutesStockChart = withOHLCData('MINUTES')(
  withSize({style: {minHeight: 600}})(withDeviceRatio()(StockChart)),
);

export const SecondsStockChart = withOHLCData('SECONDS')(
  withSize({style: {minHeight: 600}})(withDeviceRatio()(StockChart)),
);
