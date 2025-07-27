import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { AuthEndpoints } from '../constants/auth-endpoints.const';

const urlsWithoutToken = new Set<string>([AuthEndpoints.TokenUrl]);

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const isExcluded = urlsWithoutToken.has(req.url);

  if (isExcluded) {
    return next(req);
  }

  const token = authService.getTokenSync();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return from(authService.refreshToken()).pipe(
          switchMap((newToken) => {
            authService.startTokenRefreshCycle(newToken);

            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${newToken}`),
            });
            return next(newReq);
          }),
          catchError((refreshError: unknown) => {
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
}
