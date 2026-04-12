import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dealsFeature } from './data-access/deals.feature';
import { DealsEffects } from './data-access/deals.effects';

export const dealsIntakeRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState(dealsFeature),
      provideEffects([DealsEffects]),
    ],
    loadComponent: () =>
      import('./pages/deals-page/deals-page.component').then(
        (m) => m.DealsPageComponent
      ),
  },
];
