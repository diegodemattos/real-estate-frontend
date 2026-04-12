import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Subject } from 'rxjs';
import { Action } from '@ngrx/store';
import { DealsFacade } from './deals.facade';
import { DealsActions } from './deals.actions';
import { dealsFeature, DealsState } from './deals.feature';
import { Deal } from '../../../domain/models/deal.model';

describe('DealsFacade', () => {
  let facade: DealsFacade;
  let store: MockStore;
  const actions$ = new Subject<Action>();

  const deal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  const defaultState: DealsState = {
    deals: [deal],
    status: 'success',
    filters: { name: null, minPrice: null, maxPrice: null },
    mutation: { type: null, status: 'idle', targetId: null },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { [dealsFeature.name]: defaultState } }),
        provideMockActions(() => actions$),
      ],
    });

    facade = TestBed.inject(DealsFacade);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('should return the deals array from the store', () => {
    expect(facade.deals()).toEqual([deal]);
  });

  it('should return the count from totalDealsCount', () => {
    expect(facade.totalDealsCount()).toBe(1);
  });

  it('should return false from isLoading when status is not loading', () => {
    expect(facade.isLoading()).toBe(false);
  });

  it('should dispatch DealsActions.loadDeals on loadDeals', () => {
    facade.loadDeals();
    expect(store.dispatch).toHaveBeenCalledWith(DealsActions.loadDeals());
  });

  it('should dispatch DealsActions.addDeal on addDeal', () => {
    const newDeal = { dealName: 'New', purchasePrice: 1, address: 'A', noi: 0 };
    facade.addDeal(newDeal);
    expect(store.dispatch).toHaveBeenCalledWith(DealsActions.addDeal({ deal: newDeal }));
  });

  it('should dispatch DealsActions.updateDeal on updateDeal', () => {
    const updated = { id: '1', dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 };
    facade.updateDeal(updated);
    expect(store.dispatch).toHaveBeenCalledWith(DealsActions.updateDeal({ deal: updated }));
  });

  it('should dispatch DealsActions.deleteDeal on deleteDeal', () => {
    facade.deleteDeal('1');
    expect(store.dispatch).toHaveBeenCalledWith(DealsActions.deleteDeal({ id: '1' }));
  });

  it('should dispatch DealsActions.updateFilters on updateFilters', () => {
    const filters = { name: 'sun', minPrice: null, maxPrice: null };
    facade.updateFilters(filters);
    expect(store.dispatch).toHaveBeenCalledWith(DealsActions.updateFilters({ filters }));
  });

  it('should reflect mutation status from isMutating', () => {
    store.setState({
      [dealsFeature.name]: {
        ...defaultState,
        mutation: { type: 'add', status: 'loading', targetId: null },
      },
    });
    expect(facade.isMutating('add')()).toBe(true);
    expect(facade.isMutating('delete')()).toBe(false);
  });
});
