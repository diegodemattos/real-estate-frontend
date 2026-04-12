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
        redirectTo: 'auth',
        pathMatch: 'full',
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.authRoutes),
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
        redirectTo: 'deals-intake',
        pathMatch: 'full',
      },
      {
        path: 'deals-intake',
        loadChildren: () =>
          import('./features/deals-intake/deals-intake.routes').then(
            (m) => m.dealsIntakeRoutes
          ),
      },
      {
        path: 'deals-analysis',
        loadChildren: () =>
          import('./features/deals-analysis/deals-analysis.routes').then(
            (m) => m.dealsAnalysisRoutes
          ),
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
