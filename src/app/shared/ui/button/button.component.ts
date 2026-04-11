import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';
type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Shared button component used everywhere the app needs an action.
 * Handles variant styling, loading state (spinner + disabled), and
 * propagates clicks via the `action` output.
 *
 * The content inside `<app-button>` is projected as the label, so the
 * consumer keeps full control over the text / inline icons:
 *
 *   <app-button variant="primary" [loading]="isSaving()" loadingLabel="Saving...">
 *     Save
 *   </app-button>
 */
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
    if (this.disabled() || this.loading()) {
      return;
    }
    this.action.emit();
  }
}
