import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Deal } from '../models/deal.model';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';

@Component({
  selector: 'app-deals-table',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, HighlightPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="table__th">Deal Name</th>
            <th class="table__th">Address</th>
            <th class="table__th table__th--right">Purchase Price</th>
            <th class="table__th table__th--right">NOI</th>
            <th class="table__th table__th--right">Cap Rate</th>
            <th class="table__th table__th--center">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (deal of deals(); track deal.id) {
            <tr
              class="table__row"
              [class.table__row--editing]="deal.id === editingDealId()"
            >
              <td class="table__td table__td--name">
                <span
                  [innerHTML]="deal.dealName | highlight: nameFilter()"
                ></span>
              </td>
              <td class="table__td table__td--secondary">
                {{ deal.address }}
              </td>
              <td class="table__td table__td--right table__td--mono">
                {{ deal.purchasePrice | currency: 'USD' : 'symbol' : '1.0-0' }}
              </td>
              <td class="table__td table__td--right table__td--mono">
                {{ deal.noi | currency: 'USD' : 'symbol' : '1.0-0' }}
              </td>
              <td class="table__td table__td--right">
                <span
                  class="cap-rate-badge"
                  [class.cap-rate-badge--good]="isGoodCapRate(deal.capRate)"
                  [class.cap-rate-badge--high]="isHighCapRate(deal.capRate)"
                  [class.cap-rate-badge--low]="isLowCapRate(deal.capRate)"
                >
                  {{ deal.capRate | percent: '1.2-2' }}
                </span>
              </td>
              <td class="table__td table__td--center">
                <div class="table__actions">
                  <button
                    class="action-btn action-btn--edit"
                    type="button"
                    [class.action-btn--active]="deal.id === editingDealId()"
                    (click)="onEdit(deal)"
                    [attr.aria-label]="'Edit ' + deal.dealName"
                  >
                    Edit
                  </button>
                  <button
                    class="action-btn action-btn--delete"
                    type="button"
                    (click)="onDelete(deal)"
                    [attr.aria-label]="'Delete ' + deal.dealName"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .table-wrapper {
        overflow-x: auto;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        background-color: var(--color-surface);
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--font-size-sm);
      }

      .table__th {
        padding: 0.75rem 1rem;
        text-align: left;
        font-size: var(--font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-secondary);
        background-color: var(--color-bg);
        border-bottom: 1px solid var(--color-border);
        white-space: nowrap;

        &.table__th--right {
          text-align: right;
        }

        &.table__th--center {
          text-align: center;
        }
      }

      .table__row {
        border-bottom: 1px solid var(--color-border);
        transition: background-color 0.1s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: var(--color-bg);
        }
      }

      .table__row--editing {
        background-color: rgb(91 63 214 / 0.04);

        &:hover {
          background-color: rgb(91 63 214 / 0.06);
        }
      }

      .table__td {
        padding: 1rem;
        color: var(--color-text);
        vertical-align: middle;

        &.table__td--name {
          font-weight: 500;
          white-space: nowrap;
        }

        &.table__td--secondary {
          color: var(--color-text-secondary);
          font-size: var(--font-size-xs);
        }

        &.table__td--right {
          text-align: right;
        }

        &.table__td--center {
          text-align: center;
        }

        &.table__td--mono {
          font-variant-numeric: tabular-nums;
        }
      }

      .cap-rate-badge {
        display: inline-flex;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font-size: var(--font-size-xs);
        font-weight: 600;
        background-color: var(--color-bg);
        color: var(--color-text-secondary);
      }

      .cap-rate-badge--good {
        background-color: rgb(34 197 94 / 0.1);
        color: #16a34a;
      }

      .cap-rate-badge--high {
        background-color: rgb(91 63 214 / 0.1);
        color: var(--color-secondary);
      }

      .cap-rate-badge--low {
        background-color: rgb(245 158 11 / 0.1);
        color: #d97706;
      }

      .table__actions {
        display: inline-flex;
        gap: 0.375rem;
        align-items: center;
      }

      .action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.3rem 0.625rem;
        font-size: var(--font-size-xs);
        font-weight: 500;
        border-radius: var(--radius-sm);
        border: 1px solid transparent;
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease, border-color 0.15s ease,
          color 0.15s ease;
        white-space: nowrap;
      }

      .action-btn--edit {
        background-color: transparent;
        border-color: var(--color-border);
        color: var(--color-text-secondary);

        &:hover {
          background-color: rgb(91 63 214 / 0.08);
          border-color: var(--color-secondary);
          color: var(--color-secondary);
        }
      }

      .action-btn--edit.action-btn--active {
        background-color: rgb(91 63 214 / 0.1);
        border-color: var(--color-secondary);
        color: var(--color-secondary);
      }

      .action-btn--delete {
        background-color: transparent;
        border-color: transparent;
        color: var(--color-text-secondary);

        &:hover {
          background-color: rgb(239 68 68 / 0.08);
          border-color: rgb(239 68 68 / 0.3);
          color: var(--color-error);
        }
      }
    `,
  ],
})
export class DealsTableComponent {
  readonly deals = input.required<Deal[]>();
  readonly nameFilter = input<string>('');
  readonly editingDealId = input<string | null>(null);

  readonly dealEdit = output<Deal>();
  readonly dealDelete = output<string>();

  isGoodCapRate(capRate: number): boolean {
    return capRate >= 0.05 && capRate <= 0.12;
  }

  isHighCapRate(capRate: number): boolean {
    return capRate > 0.12;
  }

  isLowCapRate(capRate: number): boolean {
    return capRate > 0 && capRate < 0.05;
  }

  onEdit(deal: Deal): void {
    this.dealEdit.emit(deal);
  }

  onDelete(deal: Deal): void {
    if (window.confirm(`Delete "${deal.dealName}"? This cannot be undone.`)) {
      this.dealDelete.emit(deal.id);
    }
  }
}
