import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'deals',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'deals',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/deals/pages/deals-page/deals-page.component').then(
        (m) => m.DealsPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'deals',
  },
];
