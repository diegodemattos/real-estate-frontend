import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Shared text link for in-app navigation. Renders a styled `<a>` that
 * points at the given router path — used for "Forgot password?",
 * "Back to sign in" and similar inline links across the auth screens.
 *
 *   <app-link to="/public/password-recovery">Forgot password?</app-link>
 */
@Component({
  selector: 'app-link',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  readonly to = input.required<string>();
}
