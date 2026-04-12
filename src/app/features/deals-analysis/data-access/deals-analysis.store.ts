import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { catchError, tap, EMPTY } from 'rxjs';
import { DealsAnalysisService } from './deals-analysis.service';
import { Deal } from '../../../domain/models/deal.model';

interface DealsAnalysisState {
  deals: Deal[];
  isLoading: boolean;
}

export const DealsAnalysisStore = signalStore(
  withState<DealsAnalysisState>({ deals: [], isLoading: false }),
  withComputed(({ deals }) => ({
    totalDeals: computed(() => deals().length),
    totalPortfolioValue: computed(() =>
      deals().reduce((sum, d) => sum + d.purchasePrice, 0)
    ),
    averageCapRate: computed(() => {
      const list = deals();
      return list.length > 0
        ? list.reduce((sum, d) => sum + d.capRate, 0) / list.length
        : 0;
    }),
  })),
  withMethods((store, service = inject(DealsAnalysisService)) => ({
    loadDeals(): void {
      patchState(store, { isLoading: true });
      service
        .getDeals()
        .pipe(
          tap((deals) => patchState(store, { deals, isLoading: false })),
          catchError(() => {
            patchState(store, { isLoading: false });
            return EMPTY;
          })
        )
        .subscribe();
    },
  }))
);
