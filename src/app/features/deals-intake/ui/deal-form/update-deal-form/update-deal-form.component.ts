import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, effect, input, output } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/ui/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { DealFormBase } from '../deal-form.base';
import { Deal, UpdatedDeal } from '../../../models/deal.model';

@Component({
  selector: 'app-update-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule, PercentPipe, FormInputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './update-deal-form.component.html',
  styleUrls: ['./update-deal-form.component.scss'],
})
export class UpdateDealFormComponent extends DealFormBase {
  readonly isSaving: InputSignal<boolean> = input<boolean>(false);
  readonly dealCancelled: OutputEmitterRef<void> = output<void>();
  readonly deal: InputSignal<Deal> = input.required<Deal>();
  readonly dealUpdated: OutputEmitterRef<UpdatedDeal> = output<UpdatedDeal>();

  constructor() {
    super();
    // allowSignalWrites: true because form.patchValue() fires valueChanges
    // synchronously, writing to the toSignal-managed formValues signal
    // during this effect's execution.
    effect(
      () => {
        const deal = this.deal();
        this.form.patchValue({
          dealName: deal.dealName,
          purchasePrice: deal.purchasePrice,
          address: deal.address,
          noi: deal.noi,
        });
        this.form.markAsUntouched();
      },
      { allowSignalWrites: true }
    );
  }

  submit(): void {
    if (this.isSaving() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dealUpdated.emit({ id: this.deal().id, ...this.buildPayload() });
  }
}
