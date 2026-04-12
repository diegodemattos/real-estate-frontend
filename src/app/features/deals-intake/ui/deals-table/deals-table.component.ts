import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Deal } from '../../models/deal.model';
import { HighlightPipe } from '../../../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-deals-table',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, HighlightPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deals-table.component.html',
  styleUrls: ['./deals-table.component.scss'],
})
export class DealsTableComponent {
  readonly deals = input.required<Deal[]>();
  readonly nameFilter = input<string>('');
  readonly editingDealId = input<string | null>(null);

  readonly dealEdit = output<Deal>();
  readonly dealDelete = output<Deal>();

  protected capRateBadgeClass(capRate: number): string {
    if (capRate >= 0.05 && capRate <= 0.12) return 'cap-rate-badge cap-rate-badge--good';
    if (capRate > 0.12) return 'cap-rate-badge cap-rate-badge--high';
    if (capRate > 0 && capRate < 0.05) return 'cap-rate-badge cap-rate-badge--low';
    return 'cap-rate-badge';
  }

  onEdit(deal: Deal): void {
    this.dealEdit.emit(deal);
  }

  onDelete(deal: Deal): void {
    this.dealDelete.emit(deal);
  }
}
