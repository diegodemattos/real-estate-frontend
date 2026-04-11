import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">◎</div>
      <p class="empty-state__message">{{ message() }}</p>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 1.5rem;
        text-align: center;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        gap: 0.75rem;
      }

      .empty-state__icon {
        font-size: 1.75rem;
        opacity: 0.25;
        line-height: 1;
      }

      .empty-state__message {
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        max-width: 28rem;
        line-height: 1.6;
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly message = input.required<string>();
}
