import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
} from 'lightweight-charts';
import { of, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { switchMap } from 'rxjs/operators';
import { BarsState } from '../../../../core/storage/states/bars/bars.state';
import { Bar, BarsModeType, TimeUnit } from '../../../types/bars.types';

@Component({
  selector: 'app-historical-chart',
  imports: [],
  template: '<div #chartContainer></div>',
})
export class Chart implements OnInit, OnDestroy {
  @Input() mode: BarsModeType = 'countBack';
  @Input() interval!: number;
  @Input() periodicity!: TimeUnit;
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;

  private chart!: IChartApi;
  private candleSeries!: ISeriesApi<'Candlestick'>;
  private subscription = new Subscription();

  constructor(private store: Store) {}

  ngOnInit() {
    this.initChart();

    const bars$ = this.store.select(BarsState.loading).pipe(
      switchMap((loading) => {
        switch (this.mode) {
          case 'countBack':
            return this.store.select(BarsState.countBackBars);
          case 'dateRange':
            return this.store.select(BarsState.dateRangeBars);
          case 'timeBack':
            return this.store.select(BarsState.timeBackBars);
          default:
            return of(null);
        }
      }),
    );

    this.subscription.add(
      bars$.subscribe((bars) => {
        if (bars && bars.data) {
          this.updateChart(bars.data);
        } else {
          this.candleSeries.setData([]);
        }
      }),
    );
  }

  initChart() {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1e1e2f' },
        textColor: '#d1d4dc',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: '#44475a' },
        horzLines: { color: '#44475a' },
      },
      rightPriceScale: {
        borderColor: '#555',
      },
      timeScale: {
        timeVisible: true,
        borderColor: '#555',
      },
    });

    this.candleSeries = this.chart.addSeries(CandlestickSeries);
  }

  updateChart(bars: Bar[]) {
    const data = bars
      .map((bar) => ({
        time: Math.floor(new Date(bar.t).getTime() / 1000) as Time,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
      }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    this.candleSeries.setData(data);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
