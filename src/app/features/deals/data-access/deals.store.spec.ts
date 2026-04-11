import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DealsStore } from './deals.store';
import { DealsService } from './deals.service';
import { Deal } from '../models/deal.model';

describe('DealsStore', () => {
  let dealsService: {
    getDeals: jest.Mock;
    getDealById: jest.Mock;
    createDeal: jest.Mock;
    updateDeal: jest.Mock;
    deleteDeal: jest.Mock;
  };

  const seededDeals: Deal[] = [
    {
      id: '1',
      dealName: 'Sunset',
      purchasePrice: 1_000_000,
      address: 'A',
      noi: 80_000,
      capRate: 0.08,
    },
    {
      id: '2',
      dealName: 'Harbor',
      purchasePrice: 3_000_000,
      address: 'B',
      noi: 240_000,
      capRate: 0.08,
    },
  ];

  function inject() {
    TestBed.configureTestingModule({
      providers: [{ provide: DealsService, useValue: dealsService }],
    });
    return TestBed.inject(DealsStore);
  }

  beforeEach(() => {
    dealsService = {
      getDeals: jest.fn().mockReturnValue(of(seededDeals)),
      getDealById: jest.fn(),
      createDeal: jest.fn(),
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
    };
  });

  it('loads deals on init via onInit hook', () => {
    const store = inject();
    expect(dealsService.getDeals).toHaveBeenCalled();
    expect(store.totalDealsCount()).toBe(2);
    expect(store.isLoading()).toBe(false);
  });

  it('filteredDeals applies name filter case-insensitively', () => {
    const store = inject();
    store.updateFilters({ name: 'sun' });
    expect(store.isFiltering()).toBe(true);
    expect(store.filteredDeals()).toHaveLength(1);
    expect(store.filteredDeals()[0].id).toBe('1');
  });

  it('filteredDeals respects priceMin and priceMax', () => {
    const store = inject();
    store.updateFilters({ priceMin: 2_000_000 });
    expect(store.filteredDeals()).toHaveLength(1);
    expect(store.filteredDeals()[0].id).toBe('2');

    store.updateFilters({ priceMin: null, priceMax: 1_500_000 });
    expect(store.filteredDeals()).toHaveLength(1);
    expect(store.filteredDeals()[0].id).toBe('1');
  });

  it('clearFilters resets filter signals', () => {
    const store = inject();
    store.updateFilters({ name: 'sun', priceMin: 1, priceMax: 9 });
    store.clearFilters();
    expect(store.isFiltering()).toBe(false);
    expect(store.filteredDeals()).toHaveLength(2);
  });

  it('addDeal appends the returned deal to state', (done) => {
    const created: Deal = {
      id: '99',
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
      capRate: 0.08,
    };
    dealsService.createDeal.mockReturnValue(of(created));
    const store = inject();

    store
      .addDeal({
        dealName: 'New',
        purchasePrice: 500_000,
        address: 'C',
        noi: 40_000,
      })
      .subscribe(() => {
        expect(store.totalDealsCount()).toBe(3);
        expect(store.isMutating()).toBe(false);
        done();
      });
  });

  it('updateDeal replaces the matching row', (done) => {
    const updated: Deal = {
      id: '1',
      dealName: 'Sunset Renamed',
      purchasePrice: 1_200_000,
      address: 'A',
      noi: 96_000,
      capRate: 0.08,
    };
    dealsService.updateDeal.mockReturnValue(of(updated));
    const store = inject();

    store
      .updateDeal({
        id: '1',
        dealName: 'Sunset Renamed',
        purchasePrice: 1_200_000,
        address: 'A',
        noi: 96_000,
      })
      .subscribe(() => {
        const row = store
          .filteredDeals()
          .find((d) => d.id === '1');
        expect(row?.dealName).toBe('Sunset Renamed');
        done();
      });
  });

  it('deleteDeal removes the row from state', (done) => {
    dealsService.deleteDeal.mockReturnValue(of(void 0));
    const store = inject();

    store.deleteDeal('1').subscribe(() => {
      expect(store.totalDealsCount()).toBe(1);
      expect(store.filteredDeals().find((d) => d.id === '1')).toBeUndefined();
      done();
    });
  });

  it('clears isMutating on mutation error', (done) => {
    dealsService.deleteDeal.mockReturnValue(throwError(() => new Error('x')));
    const store = inject();

    store.deleteDeal('1').subscribe({
      error: () => {
        expect(store.isMutating()).toBe(false);
        expect(store.totalDealsCount()).toBe(2);
        done();
      },
    });
  });

  it('loadDeal delegates to dealsService.getDealById', (done) => {
    dealsService.getDealById.mockReturnValue(of(seededDeals[0]));
    const store = inject();
    store.loadDeal('1').subscribe((deal) => {
      expect(deal.id).toBe('1');
      expect(dealsService.getDealById).toHaveBeenCalledWith('1');
      done();
    });
  });
});
