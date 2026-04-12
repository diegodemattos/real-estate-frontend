import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DealsAnalysisStore } from './deals-analysis.store';
import { DealsAnalysisService } from './deals-analysis.service';
import { Deal } from '../../../domain/models/deal.model';

describe('DealsAnalysisStore', () => {
  let service: { getDeals: jest.Mock };

  const deals: Deal[] = [
    { id: '1', dealName: 'A', purchasePrice: 1_000_000, address: 'X', noi: 80_000, capRate: 0.08 },
    { id: '2', dealName: 'B', purchasePrice: 2_000_000, address: 'Y', noi: 120_000, capRate: 0.06 },
  ];

  beforeEach(() => {
    service = { getDeals: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        DealsAnalysisStore,
        { provide: DealsAnalysisService, useValue: service },
      ],
    });
  });

  it('starts with empty deals and isLoading false', () => {
    const store = TestBed.inject(DealsAnalysisStore);
    expect(store.deals()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('loadDeals populates deals on success', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);

    store.loadDeals();

    expect(store.deals()).toEqual(deals);
    expect(store.isLoading()).toBe(false);
  });

  it('loadDeals sets isLoading false on error', () => {
    service.getDeals.mockReturnValue(throwError(() => new Error('fail')));
    const store = TestBed.inject(DealsAnalysisStore);

    store.loadDeals();

    expect(store.deals()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('totalDeals returns the count', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);
    store.loadDeals();
    expect(store.totalDeals()).toBe(2);
  });

  it('totalPortfolioValue sums purchase prices', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);
    store.loadDeals();
    expect(store.totalPortfolioValue()).toBe(3_000_000);
  });

  it('averageCapRate computes the mean', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);
    store.loadDeals();
    expect(store.averageCapRate()).toBeCloseTo(0.07);
  });

  it('averageCapRate returns 0 when deals is empty', () => {
    const store = TestBed.inject(DealsAnalysisStore);
    expect(store.averageCapRate()).toBe(0);
  });
});
