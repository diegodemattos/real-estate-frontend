import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '../../data-access/auth.facade';
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
  private readonly facade = inject(AuthFacade);

  readonly isLoading: Signal<boolean> = this.facade.isMutating('requestRecovery');
  readonly isSuccess: WritableSignal<boolean> = signal(false);
  readonly errorMessage: WritableSignal<string> = signal('');

  constructor() {
    this.facade.requestRecoverySuccess$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.isSuccess.set(true));

    this.facade.requestRecoveryFailure$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.errorMessage.set('Something went wrong. Please try again.')
      );
  }

  onRecover(email: string): void {
    this.errorMessage.set('');
    this.isSuccess.set(false);
    this.facade.requestRecovery(email);
  }
}
