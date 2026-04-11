import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, timer } from 'rxjs';
import {
  Notification,
  NotificationService,
} from '../../data-access/notification.service';

const AUTO_DISMISS_MS = 3500;

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private readonly notifications = inject(NotificationService);

  protected readonly current = toSignal(this.notifications.notification$, {
    initialValue: null,
  });

  constructor() {
    // Auto-dismiss: switchMap cancels any in-flight timer when a new
    // notification arrives, so a burst of toasts can't be cleared early
    // by an older timer.
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
