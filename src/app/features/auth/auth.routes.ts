import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authFeature } from './data-access/auth.feature';
import { AuthEffects } from './data-access/auth.effects';

export const authRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState(authFeature),
      provideEffects([AuthEffects]),
    ],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: 'password-recovery',
        loadComponent: () =>
          import('./pages/password-recovery/password-recovery.component').then(
            (m) => m.PasswordRecoveryPageComponent
          ),
      },
    ],
  },
];
