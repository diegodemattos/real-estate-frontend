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

  it('should start with empty deals and isLoading false', () => {
    const store = TestBed.inject(DealsAnalysisStore);
    expect(store.deals()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('should populate deals on success when loadDeals is called', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);

    store.loadDeals();

    expect(store.deals()).toEqual(deals);
    expect(store.isLoading()).toBe(false);
  });

  it('should set isLoading false on error when loadDeals is called', () => {
    service.getDeals.mockReturnValue(throwError(() => new Error('fail')));
    const store = TestBed.inject(DealsAnalysisStore);

    store.loadDeals();

    expect(store.deals()).toEqual([]);
    expect(store.isLoading()).toBe(false);
  });

  it('should return the count from totalDeals', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);
    store.loadDeals();
    expect(store.totalDeals()).toBe(2);
  });

  it('should sum purchase prices in totalPortfolioValue', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);
    store.loadDeals();
    expect(store.totalPortfolioValue()).toBe(3_000_000);
  });

  it('should compute the mean in averageCapRate', () => {
    service.getDeals.mockReturnValue(of(deals));
    const store = TestBed.inject(DealsAnalysisStore);
    store.loadDeals();
    expect(store.averageCapRate()).toBeCloseTo(0.07);
  });

  it('should return 0 from averageCapRate when deals is empty', () => {
    const store = TestBed.inject(DealsAnalysisStore);
    expect(store.averageCapRate()).toBe(0);
  });
});
