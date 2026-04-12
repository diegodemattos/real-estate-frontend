import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Deal } from '../../../domain/models/deal.model';
import { DealsActions } from './deals.actions';
import { RequestStatus } from '../../../shared/models/request-status.models';

export interface DealsState {
  deals: Deal[];
  status: RequestStatus;
  filters: {
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
  };
  mutation: {
    type: 'add' | 'update' | 'delete' | null;
    status: RequestStatus;
    targetId: string | null;
  };
}

const initialState: DealsState = {
  deals: [],
  status: 'idle',
  filters: { name: null, minPrice: null, maxPrice: null },
  mutation: { type: null, status: 'idle', targetId: null },
};

export const dealsFeature = createFeature({
  name: 'deals',
  reducer: createReducer(
    initialState,

    on(DealsActions.loadDeals, (state) => ({ ...state, status: 'loading' as const })),
    on(DealsActions.loadDealsSuccess, (state, { deals }) => ({ ...state, deals, status: 'success' as const })),
    on(DealsActions.loadDealsFailure, (state) => ({ ...state, status: 'error' as const })),

    on(DealsActions.addDeal, (state) => ({
      ...state,
      mutation: { type: 'add' as const, status: 'loading' as const, targetId: null },
    })),
    on(DealsActions.addDealSuccess, (state, { deal }) => ({
      ...state,
      deals: [...state.deals, deal],
      mutation: { type: 'add' as const, status: 'success' as const, targetId: deal.id },
    })),
    on(DealsActions.addDealFailure, (state) => ({
      ...state,
      mutation: { ...state.mutation, status: 'error' as const },
    })),

    on(DealsActions.updateDeal, (state, { deal }) => ({
      ...state,
      mutation: { type: 'update' as const, status: 'loading' as const, targetId: deal.id },
    })),
    on(DealsActions.updateDealSuccess, (state, { deal }) => ({
      ...state,
      deals: state.deals.map((d) => (d.id === deal.id ? deal : d)),
      mutation: { type: 'update' as const, status: 'success' as const, targetId: deal.id },
    })),
    on(DealsActions.updateDealFailure, (state) => ({
      ...state,
      mutation: { ...state.mutation, status: 'error' as const },
    })),

    on(DealsActions.deleteDeal, (state, { id }) => ({
      ...state,
      mutation: { type: 'delete' as const, status: 'loading' as const, targetId: id },
    })),
    on(DealsActions.deleteDealSuccess, (state, { id }) => ({
      ...state,
      deals: state.deals.filter((d) => d.id !== id),
      mutation: { type: 'delete' as const, status: 'success' as const, targetId: id },
    })),
    on(DealsActions.deleteDealFailure, (state) => ({
      ...state,
      mutation: { ...state.mutation, status: 'error' as const },
    })),

    on(DealsActions.updateFilters, (state, { filters }) => ({ ...state, filters }))
  ),
  extraSelectors: ({ selectDeals, selectFilters, selectStatus, selectMutation }) => ({
    selectIsLoading: createSelector(selectStatus, (status) => status === 'loading'),
    selectIsMutating: (type?: Exclude<DealsState['mutation']['type'], null>) =>
      createSelector(selectMutation, (m) =>
        type !== undefined ? m.type === type && m.status === 'loading' : m.status === 'loading'
      ),
    selectTotalDealsCount: createSelector(selectDeals, (deals) => deals.length),
    selectIsFiltering: createSelector(
      selectFilters,
      (f) => f.name != null || f.minPrice != null || f.maxPrice != null
    ),
    selectFilteredDeals: createSelector(selectDeals, selectFilters, (deals, f) =>
      deals.filter((deal) => {
        const nameMatch = f.name == null || deal.dealName.toLowerCase().includes(f.name.toLowerCase());
        const minMatch = f.minPrice == null || deal.purchasePrice >= f.minPrice;
        const maxMatch = f.maxPrice == null || deal.purchasePrice <= f.maxPrice;
        return nameMatch && minMatch && maxMatch;
      })
    ),
    selectHasFilteredDeals: createSelector(
      createSelector(selectDeals, selectFilters, (deals, f) =>
        deals.filter((deal) => {
          const nameMatch = f.name == null || deal.dealName.toLowerCase().includes(f.name.toLowerCase());
          const minMatch = f.minPrice == null || deal.purchasePrice >= f.minPrice;
          const maxMatch = f.maxPrice == null || deal.purchasePrice <= f.maxPrice;
          return nameMatch && minMatch && maxMatch;
        })
      ),
      (deals) => deals.length > 0
    ),
  }),
});
