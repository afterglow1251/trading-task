import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetListExchangesResponse,
  GetListInstrumentsResponse,
  GetListProvidersResponse,
} from './types/instruments.types';
import { InstrumentsEndpoints } from './constants/instruments-endpoints.const';
import { HttpParamsBuilder } from '../../../shared/utils/http-params.util';

@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  private instrumentsUrl = InstrumentsEndpoints.BaseUrl;

  constructor(private http: HttpClient) {}

  getListInstruments(
    provider?: string,
    kind?: string,
    symbol?: string,
    page?: number,
    size?: number,
  ): Observable<GetListInstrumentsResponse> {
    const params = new HttpParamsBuilder()
      .setIfDefined('provider', provider)
      .setIfDefined('kind', kind)
      .setIfDefined('symbol', symbol)
      .setIfDefined('page', page)
      .setIfDefined('size', size)
      .build();

    return this.http.get<GetListInstrumentsResponse>(
      `${this.instrumentsUrl}${InstrumentsEndpoints.Instruments}`,
      { params },
    );
  }

  getListProviders(): Observable<GetListProvidersResponse> {
    return this.http.get<GetListProvidersResponse>(
      `${this.instrumentsUrl}${InstrumentsEndpoints.Providers}`,
    );
  }

  getListExchanges(provider?: string): Observable<GetListExchangesResponse> {
    const params = new HttpParamsBuilder()
      .setIfDefined('provider', provider)
      .build();

    return this.http.get<GetListExchangesResponse>(
      `${this.instrumentsUrl}${InstrumentsEndpoints.Exchanges}`,
      { params },
    );
  }
}
