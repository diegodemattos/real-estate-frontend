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
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
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
    ButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deals-page.component.html',
  styleUrls: ['./deals-page.component.scss'],
})
export class DealsPageComponent {
  protected readonly dealsStore = inject(DealsStore);

  // — Form modal state —
  readonly isFormModalOpen = signal(false);
  readonly isEditMode = signal(false);
  readonly isLoadingDeal = signal(false);
  readonly editingDeal = signal<Deal | null>(null);

  readonly formModalTitle = computed(() =>
    this.isEditMode() ? 'Edit Deal' : 'Add New Deal'
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
    this.isEditMode.set(false);
    this.editingDeal.set(null);
    this.isFormModalOpen.set(true);
  }

  /**
   * Opens the modal in edit mode and simulates fetching the deal from the API.
   * The modal renders a loader until the (mock) request resolves, then swaps
   * to the form pre-filled with the fresh deal snapshot.
   */
  onDealEdit(deal: Deal): void {
    this.isEditMode.set(true);
    this.editingDeal.set(null);
    this.isLoadingDeal.set(true);
    this.isFormModalOpen.set(true);

    this.dealsStore.loadDeal(deal.id).subscribe({
      next: (freshDeal) => {
        this.editingDeal.set(freshDeal);
        this.isLoadingDeal.set(false);
      },
      error: () => {
        this.isLoadingDeal.set(false);
        this.onFormModalClose();
      },
    });
  }

  onFormModalClose(): void {
    this.isFormModalOpen.set(false);
    this.isEditMode.set(false);
    this.isLoadingDeal.set(false);
    this.editingDeal.set(null);
  }

  onDealAdded(newDeal: NewDeal): void {
    this.dealsStore.addDeal(newDeal).subscribe(() => {
      this.onFormModalClose();
    });
  }

  onDealUpdated(updatedDeal: UpdatedDeal): void {
    this.dealsStore.updateDeal(updatedDeal).subscribe(() => {
      this.onFormModalClose();
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
