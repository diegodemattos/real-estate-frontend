import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  Signal,
  computed,
  input,
} from '@angular/core';
import { PercentPipe, CurrencyPipe } from '@angular/common';
import { Deal } from '../../../../domain/models/deal.model';
import { CapRateCategory, classifyCapRate } from '../../../../domain/functions/cap-rate.functions';

interface ChartPoint {
  cx: number;
  cy: number;
  color: string;
  tooltip: string;
  label: number;
}

interface LegendItem {
  number: number;
  name: string;
  price: string;
  capRate: string;
  color: string;
}

interface CapRateRange {
  color: string;
  label: string;
}

interface Tick {
  position: number;
  label: string;
}

interface ChartData {
  points: ChartPoint[];
  xTicks: Tick[];
  yTicks: Tick[];
  gridYPositions: number[];
  gridXPositions: number[];
  legendItems: LegendItem[];
}

const WIDTH: number = 800;
const HEIGHT: number = 420;
const PAD = { top: 20, right: 30, bottom: 55, left: 85 } as const;
const CHART_W: number = WIDTH - PAD.left - PAD.right;
const CHART_H: number = HEIGHT - PAD.top - PAD.bottom;

@Component({
  selector: 'app-deals-scatter-chart',
  standalone: true,
  imports: [PercentPipe, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deals-scatter-chart.component.html',
  styleUrls: ['./deals-scatter-chart.component.scss'],
})
export class DealsScatterChartComponent {
  readonly deals: InputSignal<Deal[]> = input.required<Deal[]>();

  readonly width: number = WIDTH;
  readonly height: number = HEIGHT;
  readonly pad = PAD;

  readonly capRateRanges: readonly CapRateRange[] = [
    { color: '#22c55e', label: 'Good (5%–12%)' },
    { color: '#f59e0b', label: 'High (> 12%)' },
    { color: '#ef4444', label: 'Low (< 5%)' },
  ];

  readonly chartData: Signal<ChartData | null> = computed(() => {
    const deals = this.deals();
    if (deals.length === 0) return null;

    const prices = deals.map((d) => d.purchasePrice);
    const rates = deals.map((d) => d.capRate);

    const xMax: number = niceMax(Math.max(...prices));
    const yMax: number = niceMax(Math.max(...rates));

    const xTicks: Tick[] = generateTicks(0, xMax, 5).map((v) => ({
      position: PAD.left + (v / xMax) * CHART_W,
      label: formatPrice(v),
    }));

    const yTicks: Tick[] = generateTicks(0, yMax, 5).map((v) => ({
      position: PAD.top + (1 - v / yMax) * CHART_H,
      label: formatPercent(v),
    }));

    const points: ChartPoint[] = deals.map((d, i) => ({
      cx: PAD.left + (d.purchasePrice / xMax) * CHART_W,
      cy: PAD.top + (1 - d.capRate / yMax) * CHART_H,
      color: capRateColor(d.capRate),
      tooltip: `${d.dealName}\n${formatPrice(d.purchasePrice)} · ${formatPercent(d.capRate)}`,
      label: i + 1,
    }));

    const legendItems: LegendItem[] = deals.map((d, i) => ({
      number: i + 1,
      name: d.dealName,
      price: formatPrice(d.purchasePrice),
      capRate: formatPercent(d.capRate),
      color: capRateColor(d.capRate),
    }));

    return {
      points,
      xTicks,
      yTicks,
      gridYPositions: yTicks.map((t) => t.position),
      gridXPositions: xTicks.map((t) => t.position),
      legendItems,
    };
  });
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp: number = Math.pow(10, Math.floor(Math.log10(value)));
  const frac: number = value / exp;
  if (frac <= 1) return exp;
  if (frac <= 2) return 2 * exp;
  if (frac <= 5) return 5 * exp;
  return 10 * exp;
}

function generateTicks(min: number, max: number, count: number): number[] {
  const step: number = (max - min) / count;
  return Array.from({ length: count + 1 }, (_, i) => min + step * i);
}

function formatPrice(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const CAP_RATE_COLORS: Record<CapRateCategory, string> = {
  good: 'var(--color-cap-good, #22c55e)',
  high: 'var(--color-cap-high, #f59e0b)',
  low: 'var(--color-cap-low, #ef4444)',
  neutral: 'var(--color-text-secondary, #94a3b8)',
};

function capRateColor(rate: number): string {
  return CAP_RATE_COLORS[classifyCapRate(rate)];
}
