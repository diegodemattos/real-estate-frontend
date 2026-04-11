import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './features/auth/pages/login-page/login-page.component'
          ).then((m) => m.LoginPageComponent),
      },
    ],
  },
  {
    path: '',
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
    path: '**',
    redirectTo: '',
  },
];
