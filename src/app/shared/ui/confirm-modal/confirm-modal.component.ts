import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent {
  readonly isOpen: InputSignal<boolean> = input.required<boolean>();
  readonly title: InputSignal<string> = input<string>('Confirm');
  readonly message: InputSignal<string> = input<string>('');
  readonly confirmLabel: InputSignal<string> = input<string>('Confirm');
  readonly cancelLabel: InputSignal<string> = input<string>('Cancel');
  readonly isConfirming: InputSignal<boolean> = input<boolean>(false);

  readonly confirmed: OutputEmitterRef<void> = output<void>();
  readonly cancelled: OutputEmitterRef<void> = output<void>();

  onConfirm(): void {
    if (this.isConfirming()) return;
    this.confirmed.emit();
  }

  onCancel(): void {
    if (this.isConfirming()) return;
    this.cancelled.emit();
  }
}
