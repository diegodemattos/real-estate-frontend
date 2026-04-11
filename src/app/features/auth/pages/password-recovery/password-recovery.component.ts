import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';
import { PasswordRecoveryFormComponent } from '../../ui/password-recovery-form/password-recovery-form.component';

@Component({
  selector: 'app-password-recovery-page',
  standalone: true,
  imports: [RouterLink, PasswordRecoveryFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryPageComponent {
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly isSuccess = signal(false);
  readonly errorMessage = signal('');

  onRecover(email: string): void {
    this.errorMessage.set('');
    this.isSuccess.set(false);
    this.isLoading.set(true);

    this.authService.requestPasswordRecovery(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }
}
