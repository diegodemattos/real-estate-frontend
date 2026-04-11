import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

/**
 * Placeholder page for the Closing feature. Exists only to demonstrate
 * navigation between features through the side menu — real functionality
 * will be built out later.
 */
@Component({
  selector: 'app-closing-page',
  standalone: true,
  imports: [EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './closing-page.component.html',
  styleUrls: ['./closing-page.component.scss'],
})
export class ClosingPageComponent {}
