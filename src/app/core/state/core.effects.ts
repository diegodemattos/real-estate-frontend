import { Injectable, inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap } from 'rxjs/operators';
import { SessionService } from '../services/session.service';
import { CoreActions } from './core.actions';

@Injectable()
export class CoreEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly sessionService: SessionService = inject(SessionService);

  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      filter(() => this.sessionService.isTokenValid()),
      map(() => {
        const email: string = this.sessionService.getEmail()!;
        return CoreActions.hydrateUser({ user: { email } });
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CoreActions.logout),
        tap(() => this.sessionService.clearToken())
      ),
    { dispatch: false }
  );
}
