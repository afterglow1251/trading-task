import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Chart } from '../../shared/components/historical/chart/chart';
import { InstrumentSelector } from '../../shared/components/historical/instrument-selector/instrument-selector';
import { IntervalPeriodicitySelector } from '../../shared/components/historical/interval-periodicity-selector/interval-periodicity-selector';
import { BarsSelector } from '../../shared/components/historical/bars-selector/bars-selector';
import { TimeUnit } from '../../shared/types/bars.types';
import {
  LoadBarsByDateRange,
  LoadBarsCountBack,
  LoadBarsTimeBack,
} from '../../core/storage/states/bars/bars.actions';
import { NzNotificationService } from 'ng-zorro-antd/notification';

type ModeType = 'countBack' | 'dateRange' | 'timeBack';

@Component({
  selector: 'app-historical',
  imports: [
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    FormsModule,
    InstrumentSelector,
    IntervalPeriodicitySelector,
    BarsSelector,
    Chart,
  ],
  templateUrl: './historical.html',
})
export class Historical {
  mode: ModeType = 'countBack';
  barsCount = 100;
  startDate?: Date;
  endDate?: Date;
  timeBack = '1.00:00:00';
  interval = 1;
  periodicity: TimeUnit = 'minute';
  selectedInstrument = '';
  selectedProvider = '';

  constructor(
    private store: Store,
    private notification: NzNotificationService,
  ) {}

  onFilterApply() {
    if (!this.selectedInstrument || !this.selectedProvider) {
      this.notification.error(
        'Missing Fields',
        'Instrument and Provider must be selected.',
      );
      return;
    }

    const commonPayload = {
      instrumentId: this.selectedInstrument,
      provider: this.selectedProvider,
      interval: this.interval,
      periodicity: this.periodicity,
    };

    let action;

    switch (this.mode) {
      case 'countBack':
        action = new LoadBarsCountBack({
          ...commonPayload,
          barsCount: this.barsCount,
        });
        break;

      case 'dateRange':
        if (!this.startDate) {
          this.notification.error(
            'Missing Start Date',
            'Please select a start date.',
          );
          return;
        }

        const startDateStr = this.startDate.toISOString().slice(0, 10);
        const endDateStr = this.endDate?.toISOString().slice(0, 10);

        action = new LoadBarsByDateRange({
          ...commonPayload,
          startDate: startDateStr,
          endDate: endDateStr,
        });
        break;

      case 'timeBack':
        if (!this.timeBack) {
          this.notification.error(
            'Missing Time Back',
            'Please provide a valid timeBack value.',
          );
          return;
        }

        action = new LoadBarsTimeBack({
          ...commonPayload,
          timeBack: this.timeBack,
        });
        break;
    }

    if (action) {
      this.store.dispatch(action);
    } else {
      this.notification.error(
        'Insufficient Data',
        'Please fill in all required fields.',
      );
    }
  }
}
