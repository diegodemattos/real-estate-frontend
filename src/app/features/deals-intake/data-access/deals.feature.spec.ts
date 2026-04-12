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
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@ngrx/store/init' });
    expect(state).toEqual(initialState);
  });

  describe('loadDeals', () => {
    it('sets status to loading', () => {
      const state = reducer(initialState, DealsActions.loadDeals());
      expect(state.status).toBe('loading');
    });

    it('sets deals and status to success', () => {
      const loading = reducer(initialState, DealsActions.loadDeals());
      const state = reducer(loading, DealsActions.loadDealsSuccess({ deals: [deal] }));
      expect(state.deals).toEqual([deal]);
      expect(state.status).toBe('success');
    });

    it('sets status to error on failure', () => {
      const loading = reducer(initialState, DealsActions.loadDeals());
      const state = reducer(loading, DealsActions.loadDealsFailure({ error: 'fail' }));
      expect(state.status).toBe('error');
    });
  });

  describe('addDeal', () => {
    it('sets mutation to add/loading', () => {
      const state = reducer(initialState, DealsActions.addDeal({ deal: { dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
      expect(state.mutation).toEqual({ type: 'add', status: 'loading', targetId: null });
    });

    it('appends the deal on success', () => {
      const state = reducer(initialState, DealsActions.addDealSuccess({ deal }));
      expect(state.deals).toEqual([deal]);
      expect(state.mutation.status).toBe('success');
    });

    it('sets mutation status to error on failure', () => {
      const loading = reducer(initialState, DealsActions.addDeal({ deal: { dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
      const state = reducer(loading, DealsActions.addDealFailure({ error: 'fail' }));
      expect(state.mutation.status).toBe('error');
    });
  });

  describe('updateDeal', () => {
    it('sets mutation to update/loading with targetId', () => {
      const state = reducer(initialState, DealsActions.updateDeal({ deal: { id: '1', dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
      expect(state.mutation).toEqual({ type: 'update', status: 'loading', targetId: '1' });
    });

    it('replaces the deal on success', () => {
      const withDeal = { ...initialState, deals: [deal] };
      const updated = { ...deal, dealName: 'Renamed' };
      const state = reducer(withDeal, DealsActions.updateDealSuccess({ deal: updated }));
      expect(state.deals[0].dealName).toBe('Renamed');
    });
  });

  describe('deleteDeal', () => {
    it('sets mutation to delete/loading with targetId', () => {
      const state = reducer(initialState, DealsActions.deleteDeal({ id: '1' }));
      expect(state.mutation).toEqual({ type: 'delete', status: 'loading', targetId: '1' });
    });

    it('removes the deal on success', () => {
      const withDeal = { ...initialState, deals: [deal] };
      const state = reducer(withDeal, DealsActions.deleteDealSuccess({ id: '1' }));
      expect(state.deals).toEqual([]);
    });
  });

  describe('updateFilters', () => {
    it('sets the filters', () => {
      const filters = { name: 'sun', minPrice: 100, maxPrice: null };
      const state = reducer(initialState, DealsActions.updateFilters({ filters }));
      expect(state.filters).toEqual(filters);
    });
  });
});

describe('dealsFeature selectors', () => {
  it('selectIsLoading returns true when status is loading', () => {
    expect(dealsFeature.selectIsLoading.projector('loading')).toBe(true);
    expect(dealsFeature.selectIsLoading.projector('idle')).toBe(false);
  });

  it('selectTotalDealsCount returns the deals array length', () => {
    expect(dealsFeature.selectTotalDealsCount.projector([deal])).toBe(1);
    expect(dealsFeature.selectTotalDealsCount.projector([])).toBe(0);
  });

  it('selectIsFiltering returns true when any filter is set', () => {
    expect(dealsFeature.selectIsFiltering.projector({ name: 'sun', minPrice: null, maxPrice: null })).toBe(true);
    expect(dealsFeature.selectIsFiltering.projector({ name: null, minPrice: null, maxPrice: null })).toBe(false);
  });

  it('selectFilteredDeals filters by name, minPrice, maxPrice', () => {
    const deals = [deal, { ...deal, id: '2', dealName: 'Other', purchasePrice: 500_000 }];
    const filters = { name: 'sunset', minPrice: null, maxPrice: null };
    expect(dealsFeature.selectFilteredDeals.projector(deals, filters)).toEqual([deal]);
  });

  it('selectHasFilteredDeals returns true when filtered deals exist', () => {
    expect(dealsFeature.selectHasFilteredDeals.projector([deal])).toBe(true);
    expect(dealsFeature.selectHasFilteredDeals.projector([])).toBe(false);
  });

  it('selectIsMutating returns true when matching type is loading', () => {
    const selector = dealsFeature.selectIsMutating('add');
    expect(selector.projector({ type: 'add', status: 'loading', targetId: null })).toBe(true);
    expect(selector.projector({ type: 'delete', status: 'loading', targetId: null })).toBe(false);
  });

  it('selectIsMutating without type returns true when any mutation is loading', () => {
    const selector = dealsFeature.selectIsMutating();
    expect(selector.projector({ type: 'delete', status: 'loading', targetId: '1' })).toBe(true);
    expect(selector.projector({ type: null, status: 'idle', targetId: null })).toBe(false);
  });
});
