import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, timer } from 'rxjs';
import {
  Notification,
  NotificationService,
} from '../../services/notification.service';

const AUTO_DISMISS_MS: number = 3500;

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private readonly notifications: NotificationService = inject(NotificationService);

  protected readonly current: Signal<Notification | null> = toSignal(this.notifications.notification$, {
    initialValue: null,
  });

  constructor() {
    this.notifications.notification$
      .pipe(
        filter((n): n is Notification => n !== null),
        switchMap(() => timer(AUTO_DISMISS_MS)),
        takeUntilDestroyed()
      )
      .subscribe(() => this.notifications.dismiss());
  }

  onDismiss(): void {
    this.notifications.dismiss();
  }
}
