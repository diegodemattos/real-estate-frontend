import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type AlertVariant = 'error' | 'success' | 'info' | 'warning';

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
