import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-eye-off-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eye-off-icon.component.html',
  styleUrls: ['./eye-off-icon.component.scss'],
})
export class EyeOffIconComponent {}
