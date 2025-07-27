import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  Time,
  LineSeries,
} from 'lightweight-charts';
import { Subscription } from 'rxjs';
import { RealTimePriceService } from '../../../../core/services/websocket/real-time-price.service';

@Component({
  selector: 'app-real-time-chart',
  standalone: true,
  template: ` <div #chartContainer></div>`,
})
export class Chart implements OnInit, OnDestroy {
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;

  @Input() instrumentId: string | null = null;
  @Input() provider: string | null = null;

  private chart!: IChartApi;
  private lineSeries!: ISeriesApi<'Line'>;
  private subscription = new Subscription();
  private isConnected = false;

  private currentInstrumentId: string | null = null;
  private currentProvider: string | null = null;

  constructor(private realTimePriceService: RealTimePriceService) {}

  ngOnInit(): void {
    this.initChart();

    this.realTimePriceService.connect().subscribe({
      next: (success) => {
        if (success) {
          this.isConnected = true;
        }
      },
      error: (err) => console.error('Connection error:', err),
    });

    this.subscription.add(
      this.realTimePriceService.getPriceUpdates().subscribe({
        next: (data) => this.onPriceUpdate(data),
        error: (err) => console.error('Price stream error:', err),
      }),
    );
  }

  setInstrumentAndProvider(instrumentId: string, provider: string) {
    this.instrumentId = instrumentId;
    this.provider = provider;
  }

  subscribeToSelectedInstrument(): void {
    if (this.isConnected && this.instrumentId && this.provider) {
      if (this.currentInstrumentId && this.currentProvider) {
        this.realTimePriceService.unsubscribeFromInstrument(
          this.currentInstrumentId,
          this.currentProvider,
        );
      }

      this.lineSeries.setData([]);

      this.realTimePriceService.subscribeToInstrument(
        this.instrumentId,
        this.provider,
      );

      this.currentInstrumentId = this.instrumentId;
      this.currentProvider = this.provider;
    } else {
      console.warn('WebSocket is not connected or instrument/provider not set');
    }
  }

  private initChart(): void {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1e1e2f' },
        textColor: '#d1d4dc',
        fontSize: 12,
        fontFamily: 'Arial',
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
        borderColor: '#555',
        timeVisible: true,
        secondsVisible: true,
      },
    });

    this.lineSeries = this.chart.addSeries(LineSeries, {
      color: '#4caf50',
      lineWidth: 2,
    });
  }

  private onPriceUpdate(data: any): void {
    if (!data || !data.last || !data.last.price || !data.last.timestamp) return;

    const timeUnix = Math.floor(new Date(data.last.timestamp).getTime() / 1000);

    const pricePoint = {
      time: timeUnix as Time,
      value: data.last.price as number,
    };

    this.lineSeries.update(pricePoint);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.currentInstrumentId && this.currentProvider) {
      this.realTimePriceService.unsubscribeFromInstrument(
        this.currentInstrumentId,
        this.currentProvider,
      );
    }
    if (this.chart) {
      this.chart.remove();
    }
  }
}
