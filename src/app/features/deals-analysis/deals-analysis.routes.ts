import { Routes } from '@angular/router';

export const dealsAnalysisRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/analysis-page/analysis-page.component').then(
        (m) => m.AnalysisPageComponent
      ),
  },
];
