import { Component, ViewChild } from '@angular/core';
import { InstrumentSelector } from '../../shared/components/common/instrument-selector/instrument-selector';
import { Chart } from '../../shared/components/real-time/chart/chart';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-real-time',
  imports: [InstrumentSelector, Chart, NzButtonComponent, NzWaveDirective],
  templateUrl: './real-time.html',
})
export class RealTime {
  instrumentId: string = '';
  provider: string = '';

  @ViewChild(Chart) chartComponent!: Chart;

  constructor(private notification: NzNotificationService) {}

  onSubscribeClick() {
    if (!this.instrumentId || !this.provider) {
      this.notification.error(
        'Missing Fields',
        'Instrument and Provider must be selected.',
      );
      return;
    }

    if (this.chartComponent) {
      this.chartComponent.setInstrumentAndProvider(
        this.instrumentId,
        this.provider,
      );
      this.chartComponent.subscribeToSelectedInstrument();
    }
  }
}
