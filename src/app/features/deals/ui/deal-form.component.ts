import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PercentPipe } from '@angular/common';
import { Deal, NewDeal, UpdatedDeal } from '../models/deal.model';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule, PercentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="deal-form-card" [class.deal-form-card--editing]="isEditMode()">
      <div class="deal-form-card__header">
        <h2 class="deal-form-card__title">
          {{ isEditMode() ? 'Edit Deal' : 'Add New Deal' }}
        </h2>
        @if (isEditMode()) {
          <span class="deal-form-card__editing-badge">Editing</span>
        }
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        novalidate
        class="deal-form"
      >
        <div class="form-row">
          <div class="field">
            <label class="field__label" for="dealName">Deal Name</label>
            <input
              id="dealName"
              class="field__input"
              [class.field__input--error]="isFieldInvalid('dealName')"
              type="text"
              formControlName="dealName"
              placeholder="e.g. Sunset Apartments"
            />
            @if (isFieldInvalid('dealName')) {
              <span class="field__error" role="alert">
                Deal name is required.
              </span>
            }
          </div>

          <div class="field">
            <label class="field__label" for="address">Address</label>
            <input
              id="address"
              class="field__input"
              [class.field__input--error]="isFieldInvalid('address')"
              type="text"
              formControlName="address"
              placeholder="e.g. 123 Main St, City, State"
            />
            @if (isFieldInvalid('address')) {
              <span class="field__error" role="alert">
                Address is required.
              </span>
            }
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label class="field__label" for="purchasePrice">
              Purchase Price ($)
            </label>
            <input
              id="purchasePrice"
              class="field__input"
              [class.field__input--error]="isFieldInvalid('purchasePrice')"
              type="number"
              formControlName="purchasePrice"
              placeholder="e.g. 2500000"
              min="1"
            />
            @if (isFieldInvalid('purchasePrice')) {
              @if (form.get('purchasePrice')?.errors?.['required']) {
                <span class="field__error" role="alert">
                  Purchase price is required.
                </span>
              } @else if (form.get('purchasePrice')?.errors?.['min']) {
                <span class="field__error" role="alert">
                  Purchase price must be greater than 0.
                </span>
              }
            }
          </div>

          <div class="field">
            <label class="field__label" for="noi">
              Net Operating Income ($)
            </label>
            <input
              id="noi"
              class="field__input"
              [class.field__input--error]="isFieldInvalid('noi')"
              type="number"
              formControlName="noi"
              placeholder="e.g. 175000"
              min="0"
            />
            @if (isFieldInvalid('noi')) {
              @if (form.get('noi')?.errors?.['required']) {
                <span class="field__error" role="alert">NOI is required.</span>
              } @else if (form.get('noi')?.errors?.['min']) {
                <span class="field__error" role="alert">
                  NOI cannot be negative.
                </span>
              }
            }
          </div>
        </div>

        @if (previewCapRate() !== null) {
          <div class="cap-rate-preview">
            <span class="cap-rate-preview__label">Estimated Cap Rate:</span>
            <span class="cap-rate-preview__value">
              {{ previewCapRate()! | percent: '1.2-2' }}
            </span>
          </div>
        }

        <div class="deal-form__actions">
          @if (isEditMode()) {
            <button
              class="btn btn--outline"
              type="button"
              (click)="cancel()"
            >
              Cancel
            </button>
          }
          <button class="btn btn--primary" type="submit">
            {{ isEditMode() ? 'Update Deal' : 'Add Deal' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .deal-form-card {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1.5rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .deal-form-card--editing {
        border-color: var(--color-secondary);
        box-shadow: 0 0 0 3px rgb(91 63 214 / 0.1);
      }

      .deal-form-card__header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }

      .deal-form-card__title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text);
      }

      .deal-form-card__editing-badge {
        font-size: var(--font-size-xs);
        font-weight: 600;
        padding: 0.2rem 0.625rem;
        border-radius: 9999px;
        background-color: rgb(91 63 214 / 0.1);
        color: var(--color-secondary);
      }

      .deal-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        @media (max-width: 640px) {
          grid-template-columns: 1fr;
        }
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }

      .field__label {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-text);
      }

      .field__input {
        padding: 0.625rem 0.875rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-base);
        color: var(--color-text);
        background-color: var(--color-surface);
        outline: none;
        font-family: inherit;
        width: 100%;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &:focus {
          border-color: var(--color-secondary);
          box-shadow: 0 0 0 3px rgb(91 63 214 / 0.15);
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

      .field__input--error {
        border-color: var(--color-error);

        &:focus {
          box-shadow: 0 0 0 3px rgb(239 68 68 / 0.15);
        }
      }

      .field__error {
        font-size: var(--font-size-xs);
        color: var(--color-error);
      }

      .cap-rate-preview {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        background-color: rgb(91 63 214 / 0.06);
        border: 1px solid rgb(91 63 214 / 0.2);
        border-radius: var(--radius-md);
        width: fit-content;
      }

      .cap-rate-preview__label {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      .cap-rate-preview__value {
        font-size: var(--font-size-sm);
        font-weight: 700;
        color: var(--color-secondary);
      }

      .deal-form__actions {
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
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease, border-color 0.15s ease,
          color 0.15s ease;
      }

      .btn--primary {
        background-color: var(--color-secondary);
        color: var(--color-surface);

        &:hover {
          background-color: var(--color-secondary-hover);
        }

        &:focus-visible {
          outline: 2px solid var(--color-secondary);
          outline-offset: 2px;
        }
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
export class DealFormComponent {
  /**
   * When provided, the form switches to edit mode and pre-fills with this deal.
   * When null, the form is in add mode.
   */
  readonly deal = input<Deal | null>(null);

  readonly dealAdded = output<NewDeal>();
  readonly dealUpdated = output<UpdatedDeal>();
  readonly dealCancelled = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    dealName: ['', [Validators.required]],
    purchasePrice: [null as number | null, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required]],
    noi: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  /**
   * Bridges form.valueChanges (RxJS) into the signal graph so previewCapRate
   * can be a computed() — no manual subscriptions needed.
   *
   * allowSignalWrites: true is required because patchValue() triggers
   * valueChanges synchronously, which updates the toSignal-managed signal
   * during the effect's execution.
   */
  private readonly formValues = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  readonly isEditMode = computed(() => this.deal() !== null);

  readonly previewCapRate = computed(() => {
    const { purchasePrice, noi } = this.formValues();
    if (
      purchasePrice !== null &&
      purchasePrice !== undefined &&
      purchasePrice > 0 &&
      noi !== null &&
      noi !== undefined &&
      noi >= 0
    ) {
      return noi / purchasePrice;
    }
    return null;
  });

  constructor() {
    /**
     * Sync the deal input into the form whenever it changes.
     * allowSignalWrites: true is needed because form.patchValue() triggers
     * valueChanges synchronously, which writes to the formValues signal
     * (managed by toSignal) during this effect's execution.
     */
    effect(
      () => {
        const deal = this.deal();
        if (deal !== null) {
          this.form.patchValue({
            dealName: deal.dealName,
            purchasePrice: deal.purchasePrice,
            address: deal.address,
            noi: deal.noi,
          });
          this.form.markAsUntouched();
        } else {
          this.form.reset();
        }
      },
      { allowSignalWrites: true }
    );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isEditMode()) {
      this.dealUpdated.emit({
        id: this.deal()!.id,
        dealName: value.dealName ?? '',
        purchasePrice: Number(value.purchasePrice),
        address: value.address ?? '',
        noi: Number(value.noi),
      });
    } else {
      this.dealAdded.emit({
        dealName: value.dealName ?? '',
        purchasePrice: Number(value.purchasePrice),
        address: value.address ?? '',
        noi: Number(value.noi),
      });
      this.form.reset();
    }
  }

  cancel(): void {
    this.dealCancelled.emit();
  }
}
