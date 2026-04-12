import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OutputEmitterRef,
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
  readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>('primary');
  readonly type: InputSignal<ButtonType> = input<ButtonType>('button');
  readonly disabled: InputSignal<boolean> = input<boolean>(false);
  readonly loading: InputSignal<boolean> = input<boolean>(false);
  readonly loadingLabel: InputSignal<string> = input<string>('');
  readonly full: InputSignal<boolean> = input<boolean>(false);

  readonly action: OutputEmitterRef<void> = output<void>();

  protected onClick(): void {
    if (this.disabled() || this.loading()) return;
    this.action.emit();
  }
}
