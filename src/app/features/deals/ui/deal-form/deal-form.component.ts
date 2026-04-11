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
import { FormInputComponent } from '../../../../shared/ui/form-input/form-input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { Deal, NewDeal, UpdatedDeal } from '../../models/deal.model';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PercentPipe,
    FormInputComponent,
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deal-form.component.html',
  styleUrls: ['./deal-form.component.scss'],
})
export class DealFormComponent {
  readonly deal = input<Deal | null>(null);
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

  private readonly formValues = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  readonly isEditMode = computed(() => this.deal() !== null);

  readonly submitLabel = computed(() =>
    this.isEditMode() ? 'Update Deal' : 'Add Deal'
  );

  readonly submitLoadingLabel = computed(() =>
    this.isEditMode() ? 'Updating...' : 'Adding...'
  );

  readonly previewCapRate = computed(() => {
    const { purchasePrice, noi } = this.formValues();
    if (
      purchasePrice != null &&
      purchasePrice > 0 &&
      noi != null &&
      noi >= 0
    ) {
      return noi / purchasePrice;
    }
    return null;
  });

  constructor() {
    // allowSignalWrites: true because form.patchValue() fires valueChanges
    // synchronously, writing to the toSignal-managed formValues signal
    // during this effect's execution.
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

  submit(): void {
    if (this.isSaving() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload = {
      dealName: value.dealName ?? '',
      purchasePrice: Number(value.purchasePrice),
      address: value.address ?? '',
      noi: Number(value.noi),
    };

    if (this.isEditMode()) {
      this.dealUpdated.emit({ id: this.deal()!.id, ...payload });
    } else {
      this.dealAdded.emit(payload);
    }
  }

  cancel(): void {
    this.dealCancelled.emit();
  }
}
