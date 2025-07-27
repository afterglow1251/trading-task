import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { scheduleTokenRefresh } from './utils/refresh-token.util';
import { ConnectOptions, GetTokenResponse } from './types/auth.types';
import { GetTokenBodyParams } from './constants/auth-request-params.const';
import { AuthStorageKeys } from './constants/auth-storage-keys.const';
import { AuthEndpoints } from './constants/auth-endpoints.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenUrl = AuthEndpoints.TokenUrl;
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem(AuthStorageKeys.AccessToken);
  }

  async initializeAuth(): Promise<void> {
    if (!this.accessToken) {
      try {
        const token = await this.refreshToken();
        this.startTokenRefreshCycle(token);
      } catch (error) {
        console.error('Failed to get initial token', error);
      }
    } else {
      this.startTokenRefreshCycle(this.accessToken);
    }
  }

  getAccessToken(options: ConnectOptions = {}): Observable<string> {
    const {
      grant_type = environment.fintatechApiGrantType,
      client_id = environment.fintatechApiClientId,
      username = environment.fintatechApiUsername,
      password = environment.fintatechApiPassword,
    } = options;

    const body = new HttpParams()
      .set(GetTokenBodyParams.grant_type, grant_type)
      .set(GetTokenBodyParams.client_id, client_id)
      .set(GetTokenBodyParams.username, username)
      .set(GetTokenBodyParams.password, password);

    return this.http
      .post<GetTokenResponse>(this.tokenUrl, body.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        map((response) => {
          this.accessToken = response.access_token;
          localStorage.setItem(
            AuthStorageKeys.AccessToken,
            response.access_token,
          );
          return response.access_token;
        }),
      );
  }

  getTokenSync(): string | null {
    return this.accessToken;
  }

  refreshToken(): Promise<string> {
    return firstValueFrom(this.getAccessToken());
  }

  startTokenRefreshCycle(token: string): void {
    scheduleTokenRefresh(
      token,
      () => this.refreshToken(),
      (newToken) => {
        this.accessToken = newToken;
        localStorage.setItem(AuthStorageKeys.AccessToken, newToken);
      },
    );
  }
}
