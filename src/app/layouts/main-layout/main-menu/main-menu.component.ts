import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
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
  readonly isOpen: InputSignal<boolean> = input<boolean>(false);

  readonly items: readonly NavItem[] = [
    { label: 'Deals Intake', route: '/main/deals-intake' },
    { label: 'Deals Analysis', route: '/main/deals-analysis' },
  ];
}
