import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, tap } from 'rxjs';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';
import { DealsService } from './deals.service';

const EMPTY_FILTERS: DealFilters = {
  name: '',
  priceMin: null,
  priceMax: null,
};

interface DealsState {
  deals: Deal[];
  filters: DealFilters;
  isLoading: boolean;
  isMutating: boolean;
}

const initialState: DealsState = {
  deals: [],
  filters: EMPTY_FILTERS,
  isLoading: false,
  isMutating: false,
};

/**
 * Centralised state for the deals feature, implemented with @ngrx/signals.
 *
 * The store is exposed as a regular DI token (`inject(DealsStore)`), and
 * every state field is automatically a signal (`store.deals()`,
 * `store.isLoading()`, etc.) so component templates didn't need to change
 * when migrating away from the previous hand-rolled store.
 *
 * Mutations follow the same pattern in every method:
 *   1. flip the relevant flag with `patchState`
 *   2. call the (HttpClient-backed) `DealsService`
 *   3. fold the response back into state via `patchState`
 *
 * Mutating methods return the underlying observable so callers (the deals
 * page) can subscribe and react to completion — closing the modal,
 * navigating, etc.
 */
export const DealsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isFiltering: computed(() => {
      const { name, priceMin, priceMax } = store.filters();
      return name.trim() !== '' || priceMin !== null || priceMax !== null;
    }),
    filteredDeals: computed(() => {
      const deals = store.deals();
      const { name, priceMin, priceMax } = store.filters();

      return deals.filter((deal) => {
        const matchesName =
          !name.trim() ||
          deal.dealName.toLowerCase().includes(name.toLowerCase().trim());

        const matchesPriceMin =
          priceMin === null || deal.purchasePrice >= priceMin;

        const matchesPriceMax =
          priceMax === null || deal.purchasePrice <= priceMax;

        return matchesName && matchesPriceMin && matchesPriceMax;
      });
    }),
    totalDealsCount: computed(() => store.deals().length),
  })),
  withComputed((store) => ({
    // Defined in a second `withComputed` block so it can read the
    // `filteredDeals` computed declared above.
    hasFilteredDeals: computed(() => store.filteredDeals().length > 0),
  })),
  withMethods((store, dealsService = inject(DealsService)) => ({
    loadDeals(): void {
      patchState(store, { isLoading: true });
      dealsService.getDeals().subscribe({
        next: (deals) => patchState(store, { deals, isLoading: false }),
        error: () => patchState(store, { isLoading: false }),
      });
    },

    /**
     * Fetches a single deal from the service.
     * Used by the edit flow so the modal always shows a fresh copy of the
     * record rather than the possibly-stale row the user clicked.
     */
    loadDeal(id: string): Observable<Deal> {
      return dealsService.getDealById(id);
    },

    addDeal(newDeal: NewDeal): Observable<Deal> {
      patchState(store, { isMutating: true });
      return dealsService.createDeal(newDeal).pipe(
        tap({
          next: (deal) =>
            patchState(store, {
              deals: [...store.deals(), deal],
              isMutating: false,
            }),
          error: () => patchState(store, { isMutating: false }),
        })
      );
    },

    updateDeal(updatedDeal: UpdatedDeal): Observable<Deal> {
      patchState(store, { isMutating: true });
      return dealsService.updateDeal(updatedDeal).pipe(
        tap({
          next: (deal) =>
            patchState(store, {
              deals: store.deals().map((d) => (d.id === deal.id ? deal : d)),
              isMutating: false,
            }),
          error: () => patchState(store, { isMutating: false }),
        })
      );
    },

    deleteDeal(id: string): Observable<void> {
      patchState(store, { isMutating: true });
      return dealsService.deleteDeal(id).pipe(
        tap({
          next: () =>
            patchState(store, {
              deals: store.deals().filter((d) => d.id !== id),
              isMutating: false,
            }),
          error: () => patchState(store, { isMutating: false }),
        })
      );
    },

    updateFilters(filters: Partial<DealFilters>): void {
      patchState(store, {
        filters: { ...store.filters(), ...filters },
      });
    },

    clearFilters(): void {
      patchState(store, { filters: { ...EMPTY_FILTERS } });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadDeals();
    },
  })
);
