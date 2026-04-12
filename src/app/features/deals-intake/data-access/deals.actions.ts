import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';

export const DealsActions = createActionGroup({
  source: 'Deals',
  events: {
    'Load Deals': emptyProps(),
    'Load Deals Success': props<{ deals: Deal[] }>(),
    'Load Deals Failure': props<{ error: string }>(),

    'Add Deal': props<{ deal: NewDeal }>(),
    'Add Deal Success': props<{ deal: Deal }>(),
    'Add Deal Failure': props<{ error: string }>(),

    'Update Deal': props<{ deal: UpdatedDeal }>(),
    'Update Deal Success': props<{ deal: Deal }>(),
    'Update Deal Failure': props<{ error: string }>(),

    'Delete Deal': props<{ id: string }>(),
    'Delete Deal Success': props<{ id: string }>(),
    'Delete Deal Failure': props<{ error: string }>(),

    'Update Filters': props<{ filters: DealFilters }>(),
  },
});
