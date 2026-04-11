import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../features/auth/data-access/auth.store';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
})
export class MainHeaderComponent {
  /** Reflects the current menu state so the toggle can render aria-expanded. */
  readonly isMenuOpen = input<boolean>(false);

  /** Fires whenever the user clicks the hamburger button. */
  readonly menuToggle = output<void>();

  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected onToggleMenu(): void {
    this.menuToggle.emit();
  }

  protected onLogout(): void {
    this.authStore.logout();
    this.router.navigate(['/public/login']);
  }
}
