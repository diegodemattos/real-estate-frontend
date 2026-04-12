import { DealsActions } from './deals.actions';
import { DealsState, dealsFeature } from './deals.feature';
import { Deal } from '../../../domain/models/deal.model';

const { reducer } = dealsFeature;

const deal: Deal = {
  id: '1',
  dealName: 'Sunset',
  purchasePrice: 1_000_000,
  address: 'A',
  noi: 80_000,
  capRate: 0.08,
};

const initialState: DealsState = {
  deals: [],
  status: 'idle',
  filters: { name: null, minPrice: null, maxPrice: null },
  mutation: { type: null, status: 'idle', targetId: null },
};

describe('dealsFeature reducer', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, { type: '@ngrx/store/init' });
    expect(state).toEqual(initialState);
  });

  describe('loadDeals', () => {
    it('should set status to loading', () => {
      const state = reducer(initialState, DealsActions.loadDeals());
      expect(state.status).toBe('loading');
    });

    it('should set deals and status to success', () => {
      const loading = reducer(initialState, DealsActions.loadDeals());
      const state = reducer(loading, DealsActions.loadDealsSuccess({ deals: [deal] }));
      expect(state.deals).toEqual([deal]);
      expect(state.status).toBe('success');
    });

    it('should set status to error on failure', () => {
      const loading = reducer(initialState, DealsActions.loadDeals());
      const state = reducer(loading, DealsActions.loadDealsFailure({ error: 'fail' }));
      expect(state.status).toBe('error');
    });
  });

  describe('addDeal', () => {
    it('should set mutation to add/loading', () => {
      const state = reducer(initialState, DealsActions.addDeal({ deal: { dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
      expect(state.mutation).toEqual({ type: 'add', status: 'loading', targetId: null });
    });

    it('should append the deal on success', () => {
      const state = reducer(initialState, DealsActions.addDealSuccess({ deal }));
      expect(state.deals).toEqual([deal]);
      expect(state.mutation.status).toBe('success');
    });

    it('should set mutation status to error on failure', () => {
      const loading = reducer(initialState, DealsActions.addDeal({ deal: { dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
      const state = reducer(loading, DealsActions.addDealFailure({ error: 'fail' }));
      expect(state.mutation.status).toBe('error');
    });
  });

  describe('updateDeal', () => {
    it('should set mutation to update/loading with targetId', () => {
      const state = reducer(initialState, DealsActions.updateDeal({ deal: { id: '1', dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
      expect(state.mutation).toEqual({ type: 'update', status: 'loading', targetId: '1' });
    });

    it('should replace the deal on success', () => {
      const withDeal = { ...initialState, deals: [deal] };
      const updated = { ...deal, dealName: 'Renamed' };
      const state = reducer(withDeal, DealsActions.updateDealSuccess({ deal: updated }));
      expect(state.deals[0].dealName).toBe('Renamed');
    });
  });

  describe('deleteDeal', () => {
    it('should set mutation to delete/loading with targetId', () => {
      const state = reducer(initialState, DealsActions.deleteDeal({ id: '1' }));
      expect(state.mutation).toEqual({ type: 'delete', status: 'loading', targetId: '1' });
    });

    it('should remove the deal on success', () => {
      const withDeal = { ...initialState, deals: [deal] };
      const state = reducer(withDeal, DealsActions.deleteDealSuccess({ id: '1' }));
      expect(state.deals).toEqual([]);
    });
  });

  describe('updateFilters', () => {
    it('should set the filters', () => {
      const filters = { name: 'sun', minPrice: 100, maxPrice: null };
      const state = reducer(initialState, DealsActions.updateFilters({ filters }));
      expect(state.filters).toEqual(filters);
    });

    it('should reset filters back to empty', () => {
      const filtered = reducer(initialState, DealsActions.updateFilters({ filters: { name: 'sun', minPrice: 100, maxPrice: 500 } }));
      const reset = reducer(filtered, DealsActions.updateFilters({ filters: { name: null, minPrice: null, maxPrice: null } }));
      expect(reset.filters).toEqual({ name: null, minPrice: null, maxPrice: null });
    });
  });
});

describe('dealsFeature selectors', () => {
  it('should return true from selectIsLoading when status is loading', () => {
    expect(dealsFeature.selectIsLoading.projector('loading')).toBe(true);
    expect(dealsFeature.selectIsLoading.projector('idle')).toBe(false);
  });

  it('should return the deals array length from selectTotalDealsCount', () => {
    expect(dealsFeature.selectTotalDealsCount.projector([deal])).toBe(1);
    expect(dealsFeature.selectTotalDealsCount.projector([])).toBe(0);
  });

  it('should return true from selectIsFiltering when any filter is set', () => {
    expect(dealsFeature.selectIsFiltering.projector({ name: 'sun', minPrice: null, maxPrice: null })).toBe(true);
    expect(dealsFeature.selectIsFiltering.projector({ name: null, minPrice: null, maxPrice: null })).toBe(false);
  });

  it('should filter by name in selectFilteredDeals', () => {
    const deals = [deal, { ...deal, id: '2', dealName: 'Other', purchasePrice: 500_000 }];
    const filters = { name: 'sunset', minPrice: null, maxPrice: null };
    expect(dealsFeature.selectFilteredDeals.projector(deals, filters)).toEqual([deal]);
  });

  it('should filter by minPrice in selectFilteredDeals', () => {
    const cheap = { ...deal, id: '2', dealName: 'Cheap', purchasePrice: 200_000 };
    const deals = [deal, cheap];
    expect(dealsFeature.selectFilteredDeals.projector(deals, { name: null, minPrice: 500_000, maxPrice: null })).toEqual([deal]);
  });

  it('should filter by maxPrice in selectFilteredDeals', () => {
    const expensive = { ...deal, id: '2', dealName: 'Expensive', purchasePrice: 5_000_000 };
    const deals = [deal, expensive];
    expect(dealsFeature.selectFilteredDeals.projector(deals, { name: null, minPrice: null, maxPrice: 2_000_000 })).toEqual([deal]);
  });

  it('should apply combined filters in selectFilteredDeals', () => {
    const deals = [
      deal,
      { ...deal, id: '2', dealName: 'Sunset Villa', purchasePrice: 3_000_000 },
      { ...deal, id: '3', dealName: 'Other Place', purchasePrice: 500_000 },
    ];
    const filters = { name: 'sunset', minPrice: 500_000, maxPrice: 2_000_000 };
    expect(dealsFeature.selectFilteredDeals.projector(deals, filters)).toEqual([deal]);
  });

  it('should return all deals from selectFilteredDeals when filters are empty', () => {
    const deals = [deal, { ...deal, id: '2', dealName: 'Other' }];
    const emptyFilters = { name: null, minPrice: null, maxPrice: null };
    expect(dealsFeature.selectFilteredDeals.projector(deals, emptyFilters)).toEqual(deals);
  });

  it('should return true from selectHasFilteredDeals when filtered deals exist', () => {
    expect(dealsFeature.selectHasFilteredDeals.projector([deal])).toBe(true);
    expect(dealsFeature.selectHasFilteredDeals.projector([])).toBe(false);
  });

  it('should return true from selectIsMutating when matching type is loading', () => {
    const selector = dealsFeature.selectIsMutating('add');
    expect(selector.projector({ type: 'add', status: 'loading', targetId: null })).toBe(true);
    expect(selector.projector({ type: 'delete', status: 'loading', targetId: null })).toBe(false);
  });

  it('should return true from selectIsMutating without type when any mutation is loading', () => {
    const selector = dealsFeature.selectIsMutating();
    expect(selector.projector({ type: 'delete', status: 'loading', targetId: '1' })).toBe(true);
    expect(selector.projector({ type: null, status: 'idle', targetId: null })).toBe(false);
  });
});
