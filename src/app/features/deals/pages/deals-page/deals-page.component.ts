import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DealsStore } from '../../data-access/deals.store';
import { DealFiltersComponent } from '../../ui/deal-filters/deal-filters.component';
import { DealFormComponent } from '../../ui/deal-form/deal-form.component';
import { DealsTableComponent } from '../../ui/deals-table/deals-table.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../../models/deal.model';

@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [
    DealFiltersComponent,
    DealFormComponent,
    DealsTableComponent,
    EmptyStateComponent,
    ModalComponent,
    ConfirmModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deals-page.component.html',
  styleUrls: ['./deals-page.component.scss'],
})
export class DealsPageComponent {
  protected readonly dealsStore = inject(DealsStore);

  // — Form modal state —
  readonly isFormModalOpen = signal(false);
  readonly editingDeal = signal<Deal | null>(null);

  readonly formModalTitle = computed(() =>
    this.editingDeal() !== null ? 'Edit Deal' : 'Add New Deal'
  );

  // — Delete confirmation modal state —
  readonly dealToDelete = signal<Deal | null>(null);
  readonly isDeleteModalOpen = computed(() => this.dealToDelete() !== null);
  readonly deleteModalMessage = computed(() => {
    const deal = this.dealToDelete();
    return deal
      ? `Are you sure you want to delete "${deal.dealName}"? This action cannot be undone.`
      : '';
  });

  // — Derived —
  readonly currentNameFilter = computed(() => this.dealsStore.filters().name);

  // — Form modal handlers —

  openAddModal(): void {
    this.editingDeal.set(null);
    this.isFormModalOpen.set(true);
  }

  onDealEdit(deal: Deal): void {
    this.editingDeal.set(deal);
    this.isFormModalOpen.set(true);
  }

  onFormModalClose(): void {
    this.isFormModalOpen.set(false);
    this.editingDeal.set(null);
  }

  onDealAdded(newDeal: NewDeal): void {
    this.dealsStore.addDeal(newDeal).subscribe(() => {
      this.isFormModalOpen.set(false);
    });
  }

  onDealUpdated(updatedDeal: UpdatedDeal): void {
    this.dealsStore.updateDeal(updatedDeal).subscribe(() => {
      this.isFormModalOpen.set(false);
      this.editingDeal.set(null);
    });
  }

  // — Delete modal handlers —

  onDealDeleteRequest(deal: Deal): void {
    this.dealToDelete.set(deal);
  }

  onDeleteConfirmed(): void {
    const deal = this.dealToDelete();
    if (!deal) {
      return;
    }
    if (this.editingDeal()?.id === deal.id) {
      this.onFormModalClose();
    }
    this.dealsStore.deleteDeal(deal.id).subscribe(() => {
      this.dealToDelete.set(null);
    });
  }

  onDeleteCancelled(): void {
    this.dealToDelete.set(null);
  }

  // — Filters —

  onFiltersChange(filters: DealFilters): void {
    this.dealsStore.updateFilters(filters);
  }
}
