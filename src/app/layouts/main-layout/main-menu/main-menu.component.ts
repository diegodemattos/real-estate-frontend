import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  host: {
    '[class.menu-host--open]': 'isOpen()',
  },
})
export class MainMenuComponent {
  /** Drives the slide-in/out animation. Defaults to closed. */
  readonly isOpen = input<boolean>(false);

  /**
   * Add another entry here when a new page is introduced —
   * the layout, header, and footer remain unchanged.
   */
  readonly items: readonly NavItem[] = [
    { label: 'Deals', route: '/main/deals' },
    { label: 'Closing', route: '/main/closing' },
  ];
}
