import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzSegmentedComponent } from 'ng-zorro-antd/segmented';
import { FormsModule } from '@angular/forms';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { BarsModeType } from '../../../types/bars.types';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { ensureValidNumber } from '../../../utils/number.utils';

type ModeOptions = { label: string; value: BarsModeType }[];

@Component({
  selector: 'app-bars-selector',
  standalone: true,
  imports: [
    CommonModule,
    NzSegmentedComponent,
    NzDatePickerComponent,
    NzInputModule,
    FormsModule,
    NzTooltipDirective,
    NzInputNumberComponent,
  ],
  templateUrl: './bars-selector.html',
})
export class BarsSelector {
  modeOptions: ModeOptions = [
    { label: 'Bars Count', value: 'countBack' },
    { label: 'Date Range', value: 'dateRange' },
    { label: 'Time Back', value: 'timeBack' },
  ];

  @Input() mode: BarsModeType = 'countBack';
  @Output() modeChange = new EventEmitter<BarsModeType>();

  @Input() barsCount: number = 100;
  @Output() barsCountChange = new EventEmitter<number>();

  @Input() startDate?: Date | null;
  @Output() startDateChange = new EventEmitter<Date | null>();

  @Input() endDate?: Date | null;
  @Output() endDateChange = new EventEmitter<Date | null>();

  @Input() timeBack: string = '1.00:00:00';
  @Output() timeBackChange = new EventEmitter<string>();

  onModeChange(newMode: BarsModeType) {
    this.modeChange.emit(newMode);
  }

  onBlur() {
    this.barsCount = ensureValidNumber(this.barsCount, 1);
  }
}
