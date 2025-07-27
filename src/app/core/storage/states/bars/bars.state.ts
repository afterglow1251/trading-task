import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { BarsService } from '../../../services/bars/bars.service';
import { BarsResponse } from '../../../services/bars/types/bars.types';
import { STORAGE_KEYS } from '../../config/storage-keys.const';
import { catchError, tap } from 'rxjs/operators';
import {
  ClearBars,
  LoadBarsByDateRange,
  LoadBarsCountBack,
  LoadBarsTimeBack,
} from './bars.actions';

export interface BarsStateModel {
  countBackBars: BarsResponse | null;
  dateRangeBars: BarsResponse | null;
  timeBackBars: BarsResponse | null;
  loading: boolean;
  error: string | null;
}

@State<BarsStateModel>({
  name: STORAGE_KEYS.BARS,
  defaults: {
    countBackBars: null,
    dateRangeBars: null,
    timeBackBars: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class BarsState {
  constructor(private barsService: BarsService) {}

  @Selector()
  static countBackBars(state: BarsStateModel) {
    return state.countBackBars;
  }

  @Selector()
  static dateRangeBars(state: BarsStateModel) {
    return state.dateRangeBars;
  }

  @Selector()
  static timeBackBars(state: BarsStateModel) {
    return state.timeBackBars;
  }

  @Selector()
  static loading(state: BarsStateModel) {
    return state.loading;
  }

  @Selector()
  static error(state: BarsStateModel) {
    return state.error;
  }

  @Action(LoadBarsCountBack)
  loadBarsCountBack(
    ctx: StateContext<BarsStateModel>,
    action: LoadBarsCountBack,
  ) {
    ctx.patchState({ loading: true, error: null });

    const { instrumentId, provider, interval, periodicity, barsCount } =
      action.payload;

    return this.barsService
      .getBarsCountBack(
        instrumentId,
        provider,
        interval,
        periodicity,
        barsCount,
      )
      .pipe(
        tap((response) => {
          ctx.patchState({
            countBackBars: response,
            loading: false,
          });
        }),
        catchError((error) => {
          ctx.patchState({
            loading: false,
            error: error.message || 'Load bars count back failed',
          });
          throw error;
        }),
      );
  }

  @Action(LoadBarsByDateRange)
  loadBarsByDateRange(
    ctx: StateContext<BarsStateModel>,
    action: LoadBarsByDateRange,
  ) {
    ctx.patchState({ loading: true, error: null });

    const {
      instrumentId,
      provider,
      interval,
      periodicity,
      startDate,
      endDate,
    } = action.payload;

    return this.barsService
      .getBarsByDateRange(
        instrumentId,
        provider,
        interval,
        periodicity,
        startDate,
        endDate,
      )
      .pipe(
        tap((response) => {
          ctx.patchState({
            dateRangeBars: response,
            loading: false,
          });
        }),
        catchError((error) => {
          ctx.patchState({
            loading: false,
            error: error.message || 'Load bars by date range failed',
          });
          throw error;
        }),
      );
  }

  @Action(LoadBarsTimeBack)
  loadBarsTimeBack(
    ctx: StateContext<BarsStateModel>,
    action: LoadBarsTimeBack,
  ) {
    ctx.patchState({ loading: true, error: null });

    const { instrumentId, provider, interval, periodicity, timeBack } =
      action.payload;

    return this.barsService
      .getBarsTimeBack(instrumentId, provider, interval, periodicity, timeBack)
      .pipe(
        tap((response) => {
          ctx.patchState({
            timeBackBars: response,
            loading: false,
          });
        }),
        catchError((error) => {
          ctx.patchState({
            loading: false,
            error: error.message || 'Load bars time back failed',
          });
          throw error;
        }),
      );
  }

  @Action(ClearBars)
  clearBars(ctx: StateContext<BarsStateModel>) {
    ctx.setState({
      countBackBars: null,
      dateRangeBars: null,
      timeBackBars: null,
      loading: false,
      error: null,
    });
  }
}
