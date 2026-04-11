import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type AlertVariant = 'error' | 'success' | 'info' | 'warning';

/**
 * Shared inline alert — used for form-level error/success messages.
 * Content is projected via `<ng-content>` so callers can pass plain text
 * or rich markup, and the role="alert" attribute is applied on the host
 * for screen readers.
 *
 *   <app-alert variant="error">Invalid email or password.</app-alert>
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  host: {
    role: 'alert',
  },
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('info');
}
