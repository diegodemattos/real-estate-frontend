import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AnalysisPageComponent } from './analysis-page.component';
import { DealsAnalysisStore } from '../../data-access/deals-analysis.store';
import { Deal } from '../../../../domain/models/deal.model';

describe('AnalysisPageComponent', () => {
  const deals: Deal[] = [
    { id: '1', dealName: 'A', purchasePrice: 1_000_000, address: 'X', noi: 80_000, capRate: 0.08 },
  ];

  let store: {
    deals: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal>;
    totalDeals: ReturnType<typeof signal>;
    totalPortfolioValue: ReturnType<typeof signal>;
    averageCapRate: ReturnType<typeof signal>;
    loadDeals: jest.Mock;
  };

  beforeEach(() => {
    store = {
      deals: signal(deals),
      isLoading: signal(false),
      totalDeals: signal(1),
      totalPortfolioValue: signal(1_000_000),
      averageCapRate: signal(0.08),
      loadDeals: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [AnalysisPageComponent],
    })
      .overrideComponent(AnalysisPageComponent, {
        set: { providers: [{ provide: DealsAnalysisStore, useValue: store }] },
      });
  });

  it('should call loadDeals on init', () => {
    const fixture = TestBed.createComponent(AnalysisPageComponent);
    fixture.detectChanges();
    expect(store.loadDeals).toHaveBeenCalled();
  });

  it('should render summary cards when deals are loaded', () => {
    const fixture = TestBed.createComponent(AnalysisPageComponent);
    fixture.detectChanges();

    const values = fixture.nativeElement.querySelectorAll('.summary__value');
    expect(values.length).toBe(3);
    expect(values[0].textContent.trim()).toBe('1');
  });

  it('should show empty state when no deals', () => {
    store.deals = signal([]);
    store.totalDeals = signal(0);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [AnalysisPageComponent] })
      .overrideComponent(AnalysisPageComponent, {
        set: { providers: [{ provide: DealsAnalysisStore, useValue: store }] },
      });

    const fixture = TestBed.createComponent(AnalysisPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });
});
