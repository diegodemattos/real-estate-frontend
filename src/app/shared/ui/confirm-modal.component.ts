import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [isOpen]="isOpen()" [title]="title()" (closed)="onCancel()">
      <div class="confirm">
        <p class="confirm__message">{{ message() }}</p>

        <div class="confirm__actions">
          <button class="btn btn--outline" type="button" (click)="onCancel()">
            {{ cancelLabel() }}
          </button>
          <button class="btn btn--danger" type="button" (click)="onConfirm()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </app-modal>
  `,
  styles: [
    `
      .confirm {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .confirm__message {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        line-height: 1.6;
      }

      .confirm__actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.625rem 1.5rem;
        font-size: var(--font-size-sm);
        font-weight: 500;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease, border-color 0.15s ease,
          color 0.15s ease;
      }

      .btn--outline {
        background-color: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);

        &:hover {
          background-color: var(--color-bg);
          border-color: var(--color-text-secondary);
          color: var(--color-text);
        }
      }

      .btn--danger {
        background-color: var(--color-error);
        border: 1px solid transparent;
        color: #ffffff;

        &:hover {
          background-color: #dc2626;
        }

        &:focus-visible {
          outline: 2px solid var(--color-error);
          outline-offset: 2px;
        }
      }
    `,
  ],
})
export class ConfirmModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('Confirm');
  readonly message = input<string>('');
  readonly confirmLabel = input<string>('Confirm');
  readonly cancelLabel = input<string>('Cancel');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
