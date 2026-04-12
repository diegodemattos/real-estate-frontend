import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  input,
  output,
} from '@angular/core';
import { InputSignal, OutputEmitterRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoreFacade } from '../../../core/state/core.facade';
import { AuthUser } from '../../../features/auth/models/auth.model';
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
  readonly isMenuOpen: InputSignal<boolean> = input<boolean>(false);
  readonly menuToggle: OutputEmitterRef<void> = output<void>();

  private readonly facade = inject(CoreFacade);
  private readonly router = inject(Router);

  readonly user: Signal<AuthUser | null> = this.facade.user;

  protected onToggleMenu(): void {
    this.menuToggle.emit();
  }

  protected onLogout(): void {
    this.facade.logout();
    this.router.navigate(['/public/auth/login']);
  }
}
