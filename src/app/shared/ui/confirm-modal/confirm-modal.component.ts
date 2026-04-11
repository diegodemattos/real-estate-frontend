import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('Confirm');
  readonly message = input<string>('');
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');

  /**
   * When true, both buttons are disabled and the confirm action renders a
   * spinner. Also blocks the Esc / backdrop cancel paths so the user can't
   * dismiss the modal while the in-flight request resolves.
   */
  readonly isConfirming = input<boolean>(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    if (this.isConfirming()) {
      return;
    }
    this.confirmed.emit();
  }

  onCancel(): void {
    if (this.isConfirming()) {
      return;
    }
    this.cancelled.emit();
  }
}
