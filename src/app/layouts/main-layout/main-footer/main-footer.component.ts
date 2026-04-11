import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-main-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss'],
})
export class MainFooterComponent {
  readonly currentYear = new Date().getFullYear();
}
