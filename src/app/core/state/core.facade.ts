import { Injectable, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthUser } from '../../features/auth/models/auth.model';
import { CoreActions } from './core.actions';
import { coreFeature } from './core.feature';

@Injectable({ providedIn: 'root' })
export class CoreFacade {
  private readonly store: Store = inject(Store);

  readonly user: Signal<AuthUser | null> = this.store.selectSignal(coreFeature.selectUser);
  readonly isAuthenticated: Signal<boolean> = this.store.selectSignal(coreFeature.selectIsAuthenticated);

  logout(): void {
    this.store.dispatch(CoreActions.logout());
  }
}
