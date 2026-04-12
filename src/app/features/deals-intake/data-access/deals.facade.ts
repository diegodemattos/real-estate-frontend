import { Injectable, inject } from '@angular/core';
import { Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { DealsActions } from './deals.actions';
import { DealsState, dealsFeature } from './deals.feature';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';

@Injectable({ providedIn: 'root' })
export class DealsFacade {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);

  readonly deals: Signal<Deal[]> = this.store.selectSignal(dealsFeature.selectDeals);
  readonly filters: Signal<DealFilters> = this.store.selectSignal(dealsFeature.selectFilters);
  readonly filteredDeals: Signal<Deal[]> = this.store.selectSignal(dealsFeature.selectFilteredDeals);
  readonly totalDealsCount: Signal<number> = this.store.selectSignal(dealsFeature.selectTotalDealsCount);
  readonly hasFilteredDeals: Signal<boolean> = this.store.selectSignal(dealsFeature.selectHasFilteredDeals);
  readonly isLoading: Signal<boolean> = this.store.selectSignal(dealsFeature.selectIsLoading);
  readonly isFiltering: Signal<boolean> = this.store.selectSignal(dealsFeature.selectIsFiltering);

  readonly addDealSuccess$: Observable<{ deal: Deal }> = this.actions$.pipe(ofType(DealsActions.addDealSuccess));
  readonly addDealFailure$: Observable<{ error: string }> = this.actions$.pipe(ofType(DealsActions.addDealFailure));
  readonly updateDealSuccess$: Observable<{ deal: Deal }> = this.actions$.pipe(ofType(DealsActions.updateDealSuccess));
  readonly updateDealFailure$: Observable<{ error: string }> = this.actions$.pipe(ofType(DealsActions.updateDealFailure));
  readonly deleteDealSuccess$: Observable<{ id: string }> = this.actions$.pipe(ofType(DealsActions.deleteDealSuccess));
  readonly deleteDealFailure$: Observable<{ error: string }> = this.actions$.pipe(ofType(DealsActions.deleteDealFailure));

  isMutating(type?: Exclude<DealsState['mutation']['type'], null>): Signal<boolean> {
    return this.store.selectSignal(dealsFeature.selectIsMutating(type));
  }

  loadDeals(): void {
    this.store.dispatch(DealsActions.loadDeals());
  }

  addDeal(deal: NewDeal): void {
    this.store.dispatch(DealsActions.addDeal({ deal }));
  }

  updateDeal(deal: UpdatedDeal): void {
    this.store.dispatch(DealsActions.updateDeal({ deal }));
  }

  deleteDeal(id: string): void {
    this.store.dispatch(DealsActions.deleteDeal({ id }));
  }

  updateFilters(filters: DealFilters): void {
    this.store.dispatch(DealsActions.updateFilters({ filters }));
  }
}
