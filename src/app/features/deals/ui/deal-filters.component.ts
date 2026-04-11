import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DealFilters } from '../models/deal.model';

@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-card">
      <form [formGroup]="form" class="filters">
        <div class="filters__field">
          <label class="filters__label" for="filter-name">Deal Name</label>
          <input
            id="filter-name"
            class="filters__input"
            type="text"
            formControlName="name"
            placeholder="Search by name..."
          />
        </div>

        <div class="filters__field filters__field--price">
          <span class="filters__label">Price</span>
          <div class="filters__price-range">
            <input
              id="filter-price-min"
              class="filters__input"
              type="number"
              formControlName="priceMin"
              placeholder="Min"
              min="0"
              aria-label="Minimum price"
            />
            <span class="filters__price-separator">to</span>
            <input
              id="filter-price-max"
              class="filters__input"
              type="number"
              formControlName="priceMax"
              placeholder="Max"
              min="0"
              aria-label="Maximum price"
            />
          </div>
        </div>

        <button class="btn btn--outline" type="button" (click)="onClear()">
          Clear
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .filters-card {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.25rem;
      }

      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: flex-end;
      }

      .filters__field {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        flex: 1;
        min-width: 160px;
      }

      .filters__field--price {
        min-width: 260px;
      }

      .filters__price-range {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .filters__price-separator {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .filters__label {
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-secondary);
      }

      .filters__input {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        color: var(--color-text);
        background-color: var(--color-surface);
        outline: none;
        font-family: inherit;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        width: 100%;

        &:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 2px rgb(91 63 214 / 0.1);
        }

        &::placeholder {
          color: var(--color-text-secondary);
        }

        &[type='number'] {
          -moz-appearance: textfield;
          appearance: textfield;
        }

        &[type='number']::-webkit-outer-spin-button,
        &[type='number']::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1.25rem;
        font-size: var(--font-size-sm);
        font-weight: 500;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease, border-color 0.15s ease,
          color 0.15s ease;
        white-space: nowrap;
        align-self: flex-end;
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
    `,
  ],
})
export class DealFiltersComponent {
  readonly filtersChange = output<DealFilters>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.group({
    name: [''],
    priceMin: [null as number | null],
    priceMax: [null as number | null],
  });

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        this.filtersChange.emit({
          name: values.name ?? '',
          priceMin: values.priceMin ?? null,
          priceMax: values.priceMax ?? null,
        });
      });
  }

  onClear(): void {
    this.form.reset({ name: '', priceMin: null, priceMax: null });
  }
}
