import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule, NzSelectItemInterface } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { InstrumentsState } from '../../../../core/storage/states/instruments/instruments.state';
import { LoadInstruments } from '../../../../core/storage/states/instruments/instruments.actions';
import { Instrument } from '../../../types/instruments.types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-instrument-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzIconDirective,
    NzTooltipDirective,
  ],
  templateUrl: './instrument-selector.html',
})
export class InstrumentSelector implements OnInit, OnDestroy {
  @Input() instrumentId: string | null = null;
  @Output() instrumentIdChange = new EventEmitter<string | null>();

  @Input() provider: string | null = null;
  @Output() providerChange = new EventEmitter<string | null>();

  instruments: Instrument[] = [];
  providers: string[] = [];

  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 50;

  form = new FormGroup({
    instrumentId: new FormControl<string | null>(null),
    provider: new FormControl<string | null>(null),
  });

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit() {
    this.store
      .select(InstrumentsState.loading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.store
      .selectOnce(InstrumentsState.instruments)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.instruments = res?.data || [];
        this.currentPage = res?.paging.page || 1;
        this.totalPages = res?.paging.pages || 1;

        if (this.instruments.length === 0) {
          this.store.dispatch(new LoadInstruments(1, this.pageSize));
        } else {
          this.providers = this.getProvidersForInstrument(this.instrumentId);
        }
      });

    this.store
      .select(InstrumentsState.instruments)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.instruments = res?.data || [];
        this.currentPage = res?.paging.page || 1;
        this.totalPages = res?.paging.pages || 1;

        this.providers = this.getProvidersForInstrument(this.instrumentId);
      });

    this.form.patchValue({
      instrumentId: this.instrumentId,
      provider: this.provider,
    });

    this.form
      .get('instrumentId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.instrumentId = value;
        this.instrumentIdChange.emit(value);

        this.providers = this.getProvidersForInstrument(value);
        this.form.get('provider')?.reset(null);
        this.provider = null;
        this.providerChange.emit(null);
      });

    this.form
      .get('provider')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.provider = value;
        this.providerChange.emit(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getProvidersForInstrument(instrumentId: string | null): string[] {
    const instrument = this.instruments.find((i) => i.id === instrumentId);
    return instrument ? Object.keys(instrument.mappings) : [];
  }

  filterInstrument = (input: string, option: NzSelectItemInterface): boolean =>
    typeof option.nzLabel === 'string' &&
    option.nzLabel.toLowerCase().includes(input.toLowerCase());

  get canLoadMore(): boolean {
    return this.currentPage < this.totalPages && !this.loading;
  }

  loadMore() {
    if (this.canLoadMore) {
      this.store.dispatch(
        new LoadInstruments(this.currentPage + 1, this.pageSize),
      );
    }
  }
}
