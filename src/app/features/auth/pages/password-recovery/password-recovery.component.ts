import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../data-access/auth.service';
import { PasswordRecoveryFormComponent } from '../../ui/password-recovery-form/password-recovery-form.component';
import { LinkComponent } from '../../../../shared/ui/link/link.component';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';

@Component({
  selector: 'app-password-recovery-page',
  standalone: true,
  imports: [PasswordRecoveryFormComponent, LinkComponent, AlertComponent],
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
