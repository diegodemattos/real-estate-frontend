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
import { Deal, NewDeal, UpdatedDeal } from '../../models/deal.model';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule, PercentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deal-form.component.html',
  styleUrls: ['./deal-form.component.scss'],
})
export class DealFormComponent {
  /**
   * When provided, the form switches to edit mode and pre-fills with this deal.
   * Null means add mode.
   */
  readonly deal = input<Deal | null>(null);

  /** Drives the submit button loading state while the parent persists the change. */
  readonly isSaving = input<boolean>(false);

  readonly dealAdded = output<NewDeal>();
  readonly dealUpdated = output<UpdatedDeal>();
  readonly dealCancelled = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    dealName: ['', [Validators.required]],
    purchasePrice: [
      null as number | null,
      [Validators.required, Validators.min(1)],
    ],
    address: ['', [Validators.required]],
    noi: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  /**
   * Bridges form.valueChanges (RxJS) into the signal graph so previewCapRate
   * can be a computed() — no manual subscriptions needed.
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
     * allowSignalWrites: true is required because form.patchValue() fires
     * valueChanges synchronously, which writes to the toSignal-managed
     * formValues signal during this effect's execution.
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
    if (this.isSaving() || this.form.invalid) {
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
    }
  }

  cancel(): void {
    this.dealCancelled.emit();
  }
}
