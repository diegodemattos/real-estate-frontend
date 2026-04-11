import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from '../../../../shared/ui/form-input/form-input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';

@Component({
  selector: 'app-password-recovery-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    AlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-recovery-form.component.html',
  styleUrls: ['./password-recovery-form.component.scss'],
})
export class PasswordRecoveryFormComponent {
  readonly errorMessage = input<string>('');
  readonly isLoading = input<boolean>(false);

  /** Emits the entered email when the form is submitted with valid input. */
  readonly recover = output<string>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.recover.emit(this.form.getRawValue().email);
  }
}
