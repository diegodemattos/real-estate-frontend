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
      import('./features/auth/feature/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'deals',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/deals/feature/deals-page/deals-page.component').then(
        (m) => m.DealsPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'deals',
  },
];
