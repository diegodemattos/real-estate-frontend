import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  OutputEmitterRef,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  readonly isOpen: InputSignal<boolean> = input.required<boolean>();
  readonly title: InputSignal<string> = input<string>('');
  readonly closed: OutputEmitterRef<void> = output<void>();

  readonly titleId: string = `modal-title-${Math.random().toString(36).slice(2, 9)}`;

  onClose(): void {
    this.closed.emit();
  }
}
