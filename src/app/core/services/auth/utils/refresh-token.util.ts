import { setTimeout } from 'worker-timers';
import { jwtDecode } from 'jwt-decode';

const MS_IN_SEC = 1000;
const REFRESH_THRESHOLD_MS = 60 * MS_IN_SEC;

function getMsUntilExpiration(token: string): number {
  const payload = jwtDecode<{ exp: number }>(token);
  return payload.exp * MS_IN_SEC - Date.now();
}

export function scheduleTokenRefresh(
  token: string,
  refreshFn: () => Promise<string>,
  onNewToken: (newToken: string) => void,
): void {
  const msLeft = getMsUntilExpiration(token);
  const refreshIn = msLeft - REFRESH_THRESHOLD_MS;

  if (refreshIn > 0) {
    setTimeout(async () => {
      try {
        const newToken = await refreshFn();
        onNewToken(newToken);
        scheduleTokenRefresh(newToken, refreshFn, onNewToken);
      } catch (err) {
        console.error('Failed to refresh token', err);
      }
    }, refreshIn);
  } else {
    console.warn('Token almost expired, refreshing now');
    refreshFn().then((newToken) => {
      onNewToken(newToken);
    });
  }
}
