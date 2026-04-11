import { Injectable, computed, signal } from '@angular/core';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';

const INITIAL_DEALS: Deal[] = [
  {
    id: '1',
    dealName: 'Sunset Apartments',
    purchasePrice: 2_500_000,
    address: '1234 Sunset Blvd, Los Angeles, CA',
    noi: 175_000,
    capRate: 175_000 / 2_500_000,
  },
  {
    id: '2',
    dealName: 'Downtown Office Tower',
    purchasePrice: 8_000_000,
    address: '500 Main St, New York, NY',
    noi: 640_000,
    capRate: 640_000 / 8_000_000,
  },
  {
    id: '3',
    dealName: 'Harbor Retail Center',
    purchasePrice: 3_200_000,
    address: '88 Harbor Dr, Miami, FL',
    noi: 256_000,
    capRate: 256_000 / 3_200_000,
  },
  {
    id: '4',
    dealName: 'Greenway Industrial Park',
    purchasePrice: 5_500_000,
    address: '200 Greenway Rd, Houston, TX',
    noi: 385_000,
    capRate: 385_000 / 5_500_000,
  },
  {
    id: '5',
    dealName: 'Lakeside Condos',
    purchasePrice: 1_800_000,
    address: '45 Lake Shore Dr, Chicago, IL',
    noi: 108_000,
    capRate: 108_000 / 1_800_000,
  },
];

const EMPTY_FILTERS: DealFilters = {
  name: '',
  priceMin: null,
  priceMax: null,
};

@Injectable({ providedIn: 'root' })
export class DealsStore {
  private readonly _deals = signal<Deal[]>(INITIAL_DEALS);
  private readonly _filters = signal<DealFilters>(EMPTY_FILTERS);

  readonly filters = this._filters.asReadonly();

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

  addDeal(newDeal: NewDeal): void {
    const capRate =
      newDeal.purchasePrice > 0 ? newDeal.noi / newDeal.purchasePrice : 0;

    const deal: Deal = {
      ...newDeal,
      id: Date.now().toString(),
      capRate,
    };

    this._deals.update((deals) => [...deals, deal]);
  }

  updateDeal(updatedDeal: UpdatedDeal): void {
    const capRate =
      updatedDeal.purchasePrice > 0
        ? updatedDeal.noi / updatedDeal.purchasePrice
        : 0;

    const deal: Deal = { ...updatedDeal, capRate };

    this._deals.update((deals) =>
      deals.map((d) => (d.id === deal.id ? deal : d))
    );
  }

  deleteDeal(id: string): void {
    this._deals.update((deals) => deals.filter((d) => d.id !== id));
  }

  updateFilters(filters: Partial<DealFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({ ...EMPTY_FILTERS });
  }
}
