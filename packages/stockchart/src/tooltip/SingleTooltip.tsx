import * as React from 'react';
import {ToolTipText} from './ToolTipText';
import {ToolTipTSpanLabel} from './ToolTipTSpanLabel';

export type layouts = 'horizontal' | 'horizontalRows' | 'horizontalInline' | 'vertical' | 'verticalRows';

export interface SingleTooltipProps {
  readonly origin: [number, number];
  readonly yLabel: string;
  readonly yValue: string;
  readonly onClick?: (event: React.MouseEvent, details: any) => void;
  readonly fontFamily?: string;
  readonly fontSize?: number;
  readonly fontWeight?: number;
  readonly labelFill: string;
  readonly valueFill: string;
  readonly forChart: number | string;
  readonly options: any;
  readonly layout: layouts;
  readonly withShape: boolean;
}

export class SingleTooltip extends React.Component<SingleTooltipProps> {
  public static defaultProps = {
    labelFill: '#4682B4',
    valueFill: '#000000',
    withShape: false,
  };

  /*
   * Renders the value next to the label.
   */
  public renderValueNextToLabel() {
    const {origin, yLabel, yValue, labelFill, valueFill, withShape, fontSize, fontFamily, fontWeight} = this.props;

    return (
      <g transform={`translate(${origin[0]}, ${origin[1]})`} onClick={this.handleClick}>
        {withShape ? <rect fill={valueFill} height="6" width="6" x="0" y="-6" /> : null}
        <ToolTipText fontFamily={fontFamily} fontSize={fontSize} fontWeight={fontWeight} x={withShape ? 8 : 0} y={0}>
          <ToolTipTSpanLabel fill={labelFill}>{yLabel}: </ToolTipTSpanLabel>
          <tspan fill={valueFill}>{yValue}</tspan>
        </ToolTipText>
      </g>
    );
  }

  /*
   * Renders the value beneath the label.
   */
  public renderValueBeneathLabel() {
    const {origin, yLabel, yValue, labelFill, valueFill, withShape, fontSize, fontFamily, fontWeight} = this.props;

    return (
      <g transform={`translate(${origin[0]}, ${origin[1]})`} onClick={this.handleClick}>
        {withShape ? <line stroke={valueFill} strokeWidth="4px" x1={0} x2={0} y1={2} y2={28} /> : null}
        <ToolTipText fontFamily={fontFamily} fontSize={fontSize} fontWeight={fontWeight} x={5} y={11}>
          <ToolTipTSpanLabel fill={labelFill}>{yLabel}</ToolTipTSpanLabel>
          <tspan dy="15" fill={valueFill} x="5">
            {yValue}
          </tspan>
        </ToolTipText>
      </g>
    );
  }

  /*
   * Renders the value next to the label.
   * The parent component must have a "text"-element.
   */
  public renderInline() {
    const {yLabel, yValue, labelFill, valueFill, fontSize, fontFamily, fontWeight} = this.props;

    return (
      <tspan fontFamily={fontFamily} fontSize={fontSize} fontWeight={fontWeight} onClick={this.handleClick}>
        <ToolTipTSpanLabel fill={labelFill}>{yLabel}:&nbsp;</ToolTipTSpanLabel>
        <tspan fill={valueFill}>{yValue}&nbsp;&nbsp;</tspan>
      </tspan>
    );
  }

  public render() {
    const {layout} = this.props;
    let comp: JSX.Element | null = null;

    switch (layout) {
      case 'horizontal':
        comp = this.renderValueNextToLabel();
        break;
      case 'horizontalRows':
        comp = this.renderValueBeneathLabel();
        break;
      case 'horizontalInline':
        comp = this.renderInline();
        break;
      case 'vertical':
        comp = this.renderValueNextToLabel();
        break;
      case 'verticalRows':
        comp = this.renderValueBeneathLabel();
        break;
      default:
        comp = this.renderValueNextToLabel();
    }

    return comp;
  }

  private readonly handleClick = (event: React.MouseEvent) => {
    const {onClick, forChart, options} = this.props;
    if (onClick !== undefined) {
      onClick(event, {chartId: forChart, ...options});
    }
  };
}
