import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: 'public',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import(
            './features/auth/pages/login-page/login-page.component'
          ).then((m) => m.LoginPageComponent),
      },
      {
        path: 'password-recovery',
        loadComponent: () =>
          import(
            './features/auth/pages/password-recovery/password-recovery.component'
          ).then((m) => m.PasswordRecoveryPageComponent),
      },
    ],
  },
  {
    path: 'main',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'deals',
        pathMatch: 'full',
      },
      {
        path: 'deals',
        loadComponent: () =>
          import(
            './features/deals/pages/deals-page/deals-page.component'
          ).then((m) => m.DealsPageComponent),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'main',
  },
];
