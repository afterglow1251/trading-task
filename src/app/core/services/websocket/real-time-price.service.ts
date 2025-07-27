import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface SubscriptionInfo {
  instrumentId: string;
  provider: string;
}

@Injectable({
  providedIn: 'root',
})
export class RealTimePriceService {
  private websocketUrl =
    'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=';
  private socket$: WebSocketSubject<any> | null = null;
  private priceUpdates$ = new Subject<any>();
  private isConnected = false;

  private activeSubscriptions = new Map<string, SubscriptionInfo>();

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      const token = this.authService.getTokenSync();

      if (token) {
        this.openWebSocket(token, subscriber);
      } else {
        this.authService
          .refreshToken()
          .then((newToken) => {
            this.openWebSocket(newToken, subscriber);
          })
          .catch((error) => {
            subscriber.error(
              new Error('No valid token available and failed to refresh'),
            );
          });
      }
    });
  }

  disconnect(): void {
    if (this.socket$) {
      this.unsubscribeFromAll();
      this.socket$.complete();
      this.socket$ = null;
      this.isConnected = false;
    }
  }

  private openWebSocket(token: string, subscriber: any): void {
    this.socket$ = webSocket({
      url: `${this.websocketUrl}${token}`,
      openObserver: {
        next: () => {
          this.isConnected = true;
          subscriber.next(true);
          subscriber.complete();
        },
      },
      closeObserver: {
        next: () => {
          this.isConnected = false;
          this.activeSubscriptions.clear(); // чистимо підписки при закритті
        },
      },
    });

    this.socket$.subscribe({
      next: (msg) => {
        if (['l1-snapshot', 'l1-update'].includes(msg.type)) {
          this.priceUpdates$.next(msg);
        }
      },
      error: (err) => {
        this.isConnected = false;
        this.activeSubscriptions.clear();
      },
      complete: () => {
        this.isConnected = false;
        this.activeSubscriptions.clear();
      },
    });
  }

  subscribeToInstrument(instrumentId: string, provider: string): void {
    if (!this.isConnected || !this.socket$) {
      console.warn('WebSocket not connected, cannot subscribe');
      return;
    }

    const id = crypto.randomUUID();
    const subscriptionMsg = {
      type: 'l1-subscription',
      id,
      instrumentId,
      provider,
      subscribe: true,
      kinds: ['ask', 'bid', 'last'],
    };

    this.socket$.next(subscriptionMsg);

    this.activeSubscriptions.set(id, { instrumentId, provider });
  }

  unsubscribeFromInstrument(instrumentId: string, provider: string): void {
    if (!this.isConnected || !this.socket$) {
      console.warn('WebSocket not connected, cannot unsubscribe');
      return;
    }

    const subEntry = Array.from(this.activeSubscriptions.entries()).find(
      ([_, sub]) =>
        sub.instrumentId === instrumentId && sub.provider === provider,
    );

    if (!subEntry) {
      console.warn(
        'No active subscription found for given instrument/provider',
      );
      return;
    }

    const [id] = subEntry;

    const unsubscribeMsg = {
      type: 'l1-subscription',
      id,
      instrumentId,
      provider,
      subscribe: false,
      kinds: ['ask', 'bid', 'last'],
    };

    this.socket$.next(unsubscribeMsg);

    this.activeSubscriptions.delete(id);
  }

  unsubscribeFromAll(): void {
    if (!this.isConnected || !this.socket$) {
      console.warn('WebSocket not connected, cannot unsubscribe all');
      return;
    }

    for (const [id, { instrumentId, provider }] of this.activeSubscriptions) {
      const unsubscribeMsg = {
        type: 'l1-subscription',
        id,
        instrumentId,
        provider,
        subscribe: false,
        kinds: ['ask', 'bid', 'last'],
      };

      this.socket$.next(unsubscribeMsg);
    }

    this.activeSubscriptions.clear();
  }

  getPriceUpdates(): Observable<any> {
    return this.priceUpdates$.asObservable();
  }
}
