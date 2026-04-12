import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/ui/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { DealFormBase } from '../deal-form.base';
import { NewDeal } from '../../../models/deal.model';

@Component({
  selector: 'app-add-deal-form',
  standalone: true,
  imports: [ReactiveFormsModule, PercentPipe, FormInputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-deal-form.component.html',
  styleUrls: ['./add-deal-form.component.scss'],
})
export class AddDealFormComponent extends DealFormBase {
  readonly isSaving: InputSignal<boolean> = input<boolean>(false);
  readonly dealCancelled: OutputEmitterRef<void> = output<void>();
  readonly dealAdded: OutputEmitterRef<NewDeal> = output<NewDeal>();

  submit(): void {
    if (this.isSaving() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dealAdded.emit(this.buildPayload());
  }
}
