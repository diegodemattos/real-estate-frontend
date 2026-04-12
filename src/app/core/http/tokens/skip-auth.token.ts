import { HttpContextToken } from '@angular/common/http';

export const SKIP_AUTH: HttpContextToken<boolean> = new HttpContextToken<boolean>(() => false);
