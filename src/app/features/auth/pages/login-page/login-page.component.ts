import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthFacade } from '../../data-access/auth.facade';
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
  private readonly facade = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly isLoading: Signal<boolean> = this.facade.isMutating('login');
  readonly errorMessage: WritableSignal<string> = signal('');

  constructor() {
    this.facade.loginSuccess$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.router.navigate(['/main/deals-intake']));

    this.facade.loginFailure$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.errorMessage.set('Invalid email or password. Please try again.')
      );
  }

  onLogin(credentials: LoginCredentials): void {
    this.errorMessage.set('');
    this.facade.login(credentials);
  }
}
