import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    '[class.button-host--full]': 'full()',
  },
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly loadingLabel = input<string>('');
  readonly full = input<boolean>(false);

  readonly action = output<void>();

  protected onClick(): void {
    if (this.disabled() || this.loading()) return;
    this.action.emit();
  }
}
