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

export const DealsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isFiltering: computed(() => {
      const { name, priceMin, priceMax } = store.filters();
      return name.trim() !== '' || priceMin !== null || priceMax !== null;
    }),
    filteredDeals: computed(() => {
      const { name, priceMin, priceMax } = store.filters();
      const search = name.trim().toLowerCase();

      return store.deals().filter((deal) => {
        const matchesName =
          !search || deal.dealName.toLowerCase().includes(search);
        const matchesMin = priceMin === null || deal.purchasePrice >= priceMin;
        const matchesMax = priceMax === null || deal.purchasePrice <= priceMax;
        return matchesName && matchesMin && matchesMax;
      });
    }),
    totalDealsCount: computed(() => store.deals().length),
  })),
  // Separate block so it can read the `filteredDeals` computed above.
  withComputed((store) => ({
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
      patchState(store, { filters: { ...store.filters(), ...filters } });
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
