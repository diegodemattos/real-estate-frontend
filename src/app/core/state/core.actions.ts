import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthUser } from '../../features/auth/models/auth.model';

export const CoreActions = createActionGroup({
  source: 'Core',
  events: {
    'Hydrate User': props<{ user: AuthUser }>(),
    'Set User': props<{ user: AuthUser }>(),
    'Logout': emptyProps(),
  },
});
