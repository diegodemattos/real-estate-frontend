import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-eye-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './eye-icon.component.html',
  styleUrls: ['./eye-icon.component.scss'],
})
export class EyeIconComponent {}
