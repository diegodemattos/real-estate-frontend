import { Signal, computed, inject, input, output } from '@angular/core';
import { InputSignal, OutputEmitterRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';
import { DealFormValue, NewDeal } from '../../models/deal.model';

export abstract class DealFormBase {
  // isSaving and dealCancelled must be declared in each concrete component
  // because Angular's template compiler does not pick up signal-based
  // input()/output() defined in abstract base classes.
  abstract readonly isSaving: InputSignal<boolean>;
  abstract readonly dealCancelled: OutputEmitterRef<void>;

  protected readonly fb: FormBuilder = inject(FormBuilder);

  readonly form: FormGroup<{ [K in keyof DealFormValue]: FormControl<DealFormValue[K]> }> = this.fb.group({
    dealName: ['', [Validators.required, noWhitespaceValidator]],
    purchasePrice: [null as number | null, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required, noWhitespaceValidator]],
    noi: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  private readonly formValues: Signal<DealFormValue> = toSignal(
    this.form.valueChanges as Observable<DealFormValue>,
    { initialValue: this.form.value as DealFormValue }
  );

  private readonly formStatus: Signal<FormControlStatus> = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly isFormValid: Signal<boolean> = computed(() => this.formStatus() === 'VALID');

  readonly previewCapRate: Signal<number | null> = computed(() => {
    const { purchasePrice, noi } = this.formValues();
    if (purchasePrice != null && purchasePrice > 0 && noi != null && noi >= 0) {
      return noi / purchasePrice;
    }
    return null;
  });

  abstract submit(): void;

  cancel(): void {
    this.dealCancelled.emit();
  }

  protected buildPayload(): NewDeal {
    const value = this.form.getRawValue();
    return {
      dealName: value.dealName ?? '',
      purchasePrice: Number(value.purchasePrice),
      address: value.address ?? '',
      noi: Number(value.noi),
    };
  }
}
