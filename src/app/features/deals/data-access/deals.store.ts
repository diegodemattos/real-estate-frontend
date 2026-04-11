import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';
import { DealsService } from './deals.service';

const EMPTY_FILTERS: DealFilters = {
  name: '',
  priceMin: null,
  priceMax: null,
};

@Injectable({ providedIn: 'root' })
export class DealsStore {
  private readonly dealsService = inject(DealsService);

  private readonly _deals = signal<Deal[]>([]);
  private readonly _filters = signal<DealFilters>(EMPTY_FILTERS);
  private readonly _isLoading = signal(false);
  private readonly _isMutating = signal(false);

  readonly filters = this._filters.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isMutating = this._isMutating.asReadonly();

  readonly isFiltering = computed(() => {
    const { name, priceMin, priceMax } = this._filters();
    return name.trim() !== '' || priceMin !== null || priceMax !== null;
  });

  readonly filteredDeals = computed(() => {
    const deals = this._deals();
    const { name, priceMin, priceMax } = this._filters();

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
  });

  readonly hasFilteredDeals = computed(() => this.filteredDeals().length > 0);
  readonly totalDealsCount = computed(() => this._deals().length);

  constructor() {
    this.loadDeals();
  }

  /**
   * Fetches the deals from the service and hydrates the store.
   * Called once at bootstrap; expose it so callers can refresh on demand.
   */
  loadDeals(): void {
    this._isLoading.set(true);
    this.dealsService.getDeals().subscribe({
      next: (deals) => {
        this._deals.set(deals);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }

  addDeal(newDeal: NewDeal): Observable<Deal> {
    this._isMutating.set(true);
    return this.dealsService.createDeal(newDeal).pipe(
      tap({
        next: (deal) => {
          this._deals.update((deals) => [...deals, deal]);
          this._isMutating.set(false);
        },
        error: () => this._isMutating.set(false),
      })
    );
  }

  updateDeal(updatedDeal: UpdatedDeal): Observable<Deal> {
    this._isMutating.set(true);
    return this.dealsService.updateDeal(updatedDeal).pipe(
      tap({
        next: (deal) => {
          this._deals.update((deals) =>
            deals.map((d) => (d.id === deal.id ? deal : d))
          );
          this._isMutating.set(false);
        },
        error: () => this._isMutating.set(false),
      })
    );
  }

  deleteDeal(id: string): Observable<void> {
    this._isMutating.set(true);
    return this.dealsService.deleteDeal(id).pipe(
      tap({
        next: () => {
          this._deals.update((deals) => deals.filter((d) => d.id !== id));
          this._isMutating.set(false);
        },
        error: () => this._isMutating.set(false),
      })
    );
  }

  updateFilters(filters: Partial<DealFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({ ...EMPTY_FILTERS });
  }
}
