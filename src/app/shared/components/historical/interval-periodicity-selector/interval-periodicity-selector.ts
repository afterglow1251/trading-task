import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzRadioComponent, NzRadioGroupComponent } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { TimeUnit } from '../../../types/bars.types';
import { getReadableUnit } from '../../../utils/time-utils';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { ensureValidNumber } from '../../../utils/number.utils';

@Component({
  selector: 'app-interval-periodicity-selector',
  imports: [
    FormsModule,
    NzRadioGroupComponent,
    NzRadioComponent,
    NzTooltipDirective,
    NzInputNumberComponent,
    NzTagComponent,
  ],
  templateUrl: './interval-periodicity-selector.html',
  styleUrl: './interval-periodicity-selector.less',
})
export class IntervalPeriodicitySelector {
  @Input() interval: number = 1;
  @Input() periodicity: TimeUnit = 'minute';

  @Output() intervalChange = new EventEmitter<number>();
  @Output() periodicityChange = new EventEmitter<TimeUnit>();

  onIntervalChange(value: number) {
    this.interval = value;
    this.intervalChange.emit(this.interval);
  }

  onPeriodicityChange(value: TimeUnit) {
    this.periodicity = value;
    this.periodicityChange.emit(this.periodicity);
  }

  onBlur() {
    this.interval = ensureValidNumber(this.interval, 1);
  }

  getReadableUnit(unit: string): string {
    return getReadableUnit(unit, this.interval);
  }
}
