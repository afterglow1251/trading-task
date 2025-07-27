import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BarsResponse } from './types/bars.types';
import { BarsEndpoints } from './constants/bars-endpoints.const';
import { HttpParamsBuilder } from '../../../shared/utils/http-params.util';
import { TimeUnit } from '../../../shared/types/bars.types';

@Injectable({
  providedIn: 'root',
})
export class BarsService {
  private barsUrl = BarsEndpoints.BaseUrl;

  constructor(private http: HttpClient) {}

  getBarsCountBack(
    instrumentId: string,
    provider: string,
    interval: number,
    periodicity: TimeUnit,
    barsCount: number,
  ): Observable<BarsResponse> {
    const params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval.toString())
      .set('periodicity', periodicity)
      .set('barsCount', barsCount.toString());

    return this.http.get<BarsResponse>(
      `${this.barsUrl}${BarsEndpoints.CountBack}`,
      { params },
    );
  }

  getBarsByDateRange(
    instrumentId: string,
    provider: string,
    interval: number,
    periodicity: TimeUnit,
    startDate: string,
    endDate?: string,
  ): Observable<BarsResponse> {
    const params = new HttpParamsBuilder()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval.toString())
      .set('periodicity', periodicity)
      .set('startDate', startDate)
      .setIfDefined('endDate', endDate)
      .build();

    return this.http.get<BarsResponse>(
      `${this.barsUrl}${BarsEndpoints.DateRange}`,
      { params },
    );
  }

  getBarsTimeBack(
    instrumentId: string,
    provider: string,
    interval: number,
    periodicity: TimeUnit,
    timeBack: string, // format "1.00:00:00" (days.hours:minutes:seconds)
  ): Observable<BarsResponse> {
    const params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval.toString())
      .set('periodicity', periodicity)
      .set('timeBack', timeBack);

    return this.http.get<BarsResponse>(
      `${this.barsUrl}${BarsEndpoints.TimeBack}`,
      { params },
    );
  }
}
