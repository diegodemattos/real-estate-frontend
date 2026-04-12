import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuthUser, LoginCredentials } from '../models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: LoginCredentials }>(),
    'Login Success': props<{ user: AuthUser }>(),
    'Login Failure': props<{ error: string }>(),

    'Request Recovery': props<{ email: string }>(),
    'Request Recovery Success': emptyProps(),
    'Request Recovery Failure': props<{ error: string }>(),
  },
});
