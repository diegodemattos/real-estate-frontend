import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DealsService } from './deals.service';
import { DealsActions } from './deals.actions';

@Injectable()
export class DealsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dealsService = inject(DealsService);

  loadDeals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.loadDeals),
      switchMap(() =>
        this.dealsService.getDeals().pipe(
          map((deals) => DealsActions.loadDealsSuccess({ deals })),
          catchError((error: Error) =>
            of(DealsActions.loadDealsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.addDeal),
      switchMap(({ deal }) =>
        this.dealsService.createDeal(deal).pipe(
          map((created) => DealsActions.addDealSuccess({ deal: created })),
          catchError((error: Error) =>
            of(DealsActions.addDealFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.updateDeal),
      switchMap(({ deal }) =>
        this.dealsService.updateDeal(deal).pipe(
          map((updated) => DealsActions.updateDealSuccess({ deal: updated })),
          catchError((error: Error) =>
            of(DealsActions.updateDealFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteDeal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DealsActions.deleteDeal),
      switchMap(({ id }) =>
        this.dealsService.deleteDeal(id).pipe(
          map(() => DealsActions.deleteDealSuccess({ id })),
          catchError((error: Error) =>
            of(DealsActions.deleteDealFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
