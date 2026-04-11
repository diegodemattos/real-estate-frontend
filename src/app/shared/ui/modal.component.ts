import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        class="modal-backdrop"
        role="presentation"
        (click)="onClose()"
      >
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          (click)="$event.stopPropagation()"
        >
          <div class="modal__header">
            <h2 class="modal__title" [id]="titleId">{{ title() }}</h2>
            <button
              class="modal__close"
              type="button"
              aria-label="Close"
              (click)="onClose()"
            >
              ✕
            </button>
          </div>
          <div class="modal__body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgb(15 23 42 / 0.5);
        backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        z-index: 100;
        animation: backdrop-in 0.15s ease;
      }

      @keyframes backdrop-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .modal {
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15),
          0 8px 10px -6px rgb(0 0 0 / 0.1);
        width: 100%;
        max-width: 680px;
        max-height: calc(100dvh - 3rem);
        overflow-y: auto;
        animation: modal-in 0.15s ease;
      }

      @keyframes modal-in {
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--color-border);
        position: sticky;
        top: 0;
        background-color: var(--color-surface);
        z-index: 1;
      }

      .modal__title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text);
      }

      .modal__close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        border: none;
        border-radius: var(--radius-md);
        background-color: transparent;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        font-family: inherit;
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;

        &:hover {
          background-color: var(--color-bg);
          color: var(--color-text);
        }

        &:focus-visible {
          outline: 2px solid var(--color-secondary);
          outline-offset: 2px;
        }
      }

      .modal__body {
        padding: 1.5rem;
      }
    `,
  ],
})
export class ModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('');
  readonly closed = output<void>();

  /**
   * Stable ID linking aria-labelledby to the modal title.
   * Unique per instance via a short random suffix.
   */
  readonly titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.onClose();
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
