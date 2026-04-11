import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthStore } from '../../data-access/auth.store';
import { LoginFormComponent } from '../../ui/login-form/login-form.component';
import { LoginCredentials } from '../../models/auth.model';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly errorMessage = signal('');

  onLogin(credentials: LoginCredentials): void {
    this.errorMessage.set('');

    this.authStore
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success) => {
        if (success) {
          this.router.navigate(['/main/deals']);
        } else {
          this.errorMessage.set('Invalid email or password. Please try again.');
        }
      });
  }
}
