import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { InstrumentsService } from '../../../services/instruments/instruments.service';
import {
  GetListExchangesResponse,
  GetListInstrumentsResponse,
  GetListProvidersResponse,
} from '../../../services/instruments/types/instruments.types';
import { STORAGE_KEYS } from '../../config/storage-keys.const';
import { catchError, tap } from 'rxjs/operators';
import {
  LoadInstruments,
  LoadProviders,
  LoadExchanges,
  ClearInstruments,
} from './instruments.actions';

export interface InstrumentsStateModel {
  instruments: GetListInstrumentsResponse | null;
  providers: GetListProvidersResponse | null;
  exchanges: GetListExchangesResponse | null;
  loading: boolean;
  error: string | null;
}

@State<InstrumentsStateModel>({
  name: STORAGE_KEYS.INSTRUMENTS,
  defaults: {
    instruments: null,
    providers: null,
    exchanges: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class InstrumentsState {
  constructor(private instrumentsService: InstrumentsService) {}

  @Selector()
  static instruments(state: InstrumentsStateModel) {
    return state.instruments;
  }

  @Selector()
  static providers(state: InstrumentsStateModel) {
    return state.providers;
  }

  @Selector()
  static exchanges(state: InstrumentsStateModel) {
    return state.exchanges;
  }

  @Selector()
  static loading(state: InstrumentsStateModel) {
    return state.loading;
  }

  @Selector()
  static error(state: InstrumentsStateModel) {
    return state.error;
  }

  @Action(LoadInstruments)
  loadInstruments(
    ctx: StateContext<InstrumentsStateModel>,
    action: LoadInstruments,
  ) {
    ctx.patchState({ loading: true, error: null });

    return this.instrumentsService
      .getListInstruments(
        action.provider,
        action.kind,
        action.symbol,
        action.page,
        action.size,
      )
      .pipe(
        tap((response) => {
          const prevInstruments = ctx.getState().instruments?.data || [];

          const newData =
            action.page === 1
              ? response.data
              : [...prevInstruments, ...response.data];

          ctx.patchState({
            instruments: {
              ...response,
              data: newData,
            },
            loading: false,
          });
        }),
        catchError((error) => {
          ctx.patchState({
            loading: false,
            error: error.message || 'Load instruments failed',
          });
          throw error;
        }),
      );
  }

  @Action(LoadProviders)
  loadProviders(ctx: StateContext<InstrumentsStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.instrumentsService.getListProviders().pipe(
      tap((response) => {
        ctx.patchState({
          providers: response,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Load providers failed',
        });
        throw error;
      }),
    );
  }

  @Action(LoadExchanges)
  loadExchanges(
    ctx: StateContext<InstrumentsStateModel>,
    action: LoadExchanges,
  ) {
    ctx.patchState({ loading: true, error: null });

    return this.instrumentsService.getListExchanges(action.provider).pipe(
      tap((response) => {
        ctx.patchState({
          exchanges: response,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message || 'Load exchanges failed',
        });
        throw error;
      }),
    );
  }

  @Action(ClearInstruments)
  clearInstruments(ctx: StateContext<InstrumentsStateModel>) {
    ctx.setState({
      instruments: null,
      providers: null,
      exchanges: null,
      loading: false,
      error: null,
    });
  }
}
