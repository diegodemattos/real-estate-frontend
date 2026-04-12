import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type NotificationVariant = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  variant: NotificationVariant;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notification$: BehaviorSubject<Notification | null> = new BehaviorSubject<Notification | null>(
    null
  );
  private idCounter: number = 0;

  readonly notification$: Observable<Notification | null> =
    this._notification$.asObservable();

  private show(message: string, variant: NotificationVariant): void {
    this._notification$.next({
      id: `notification-${++this.idCounter}`,
      message,
      variant,
    });
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(): void {
    this._notification$.next(null);
  }
}
