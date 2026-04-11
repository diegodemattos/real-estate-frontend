import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DealsStore } from '../../data-access/deals.store';
import { DealFiltersComponent } from '../../ui/deal-filters/deal-filters.component';
import { DealFormComponent } from '../../ui/deal-form/deal-form.component';
import { DealsTableComponent } from '../../ui/deals-table/deals-table.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ConfirmModalComponent } from '../../../../shared/ui/confirm-modal/confirm-modal.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { NotificationService } from '../../../../shared/services/notification.service';
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
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isFormModalOpen = signal(false);
  readonly isEditMode = signal(false);
  readonly isLoadingDeal = signal(false);
  readonly editingDeal = signal<Deal | null>(null);

  readonly formModalTitle = computed(() =>
    this.isEditMode() ? 'Edit Deal' : 'Add New Deal'
  );

  readonly dealToDelete = signal<Deal | null>(null);
  readonly isDeleteModalOpen = computed(() => this.dealToDelete() !== null);
  readonly deleteModalMessage = computed(() => {
    const deal = this.dealToDelete();
    return deal
      ? `Are you sure you want to delete "${deal.dealName}"? This action cannot be undone.`
      : '';
  });

  readonly currentNameFilter = computed(() => this.dealsStore.filters().name);
  readonly dealsCountLabel = computed(() =>
    this.dealsStore.totalDealsCount() === 1 ? 'deal' : 'deals'
  );

  openAddModal(): void {
    this.isEditMode.set(false);
    this.editingDeal.set(null);
    this.isFormModalOpen.set(true);
  }

  onDealEdit(deal: Deal): void {
    this.isEditMode.set(true);
    this.editingDeal.set(null);
    this.isLoadingDeal.set(true);
    this.isFormModalOpen.set(true);

    this.dealsStore
      .loadDeal(deal.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (freshDeal) => {
          this.editingDeal.set(freshDeal);
          this.isLoadingDeal.set(false);
        },
        error: () => {
          this.isLoadingDeal.set(false);
          this.onFormModalClose();
          this.notifications.error('Failed to load deal details.');
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
    this.dealsStore
      .addDeal(newDeal)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deal) => {
          this.onFormModalClose();
          this.notifications.success(`Deal "${deal.dealName}" created.`);
        },
        error: () => this.notifications.error('Failed to create deal.'),
      });
  }

  onDealUpdated(updatedDeal: UpdatedDeal): void {
    this.dealsStore
      .updateDeal(updatedDeal)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (deal) => {
          this.onFormModalClose();
          this.notifications.success(`Deal "${deal.dealName}" updated.`);
        },
        error: () => this.notifications.error('Failed to update deal.'),
      });
  }

  onDealDeleteRequest(deal: Deal): void {
    this.dealToDelete.set(deal);
  }

  onDeleteConfirmed(): void {
    const deal = this.dealToDelete();
    if (!deal) return;

    if (this.editingDeal()?.id === deal.id) {
      this.onFormModalClose();
    }
    this.dealsStore
      .deleteDeal(deal.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.dealToDelete.set(null);
          this.notifications.success(`Deal "${deal.dealName}" deleted.`);
        },
        error: () => {
          this.dealToDelete.set(null);
          this.notifications.error('Failed to delete deal.');
        },
      });
  }

  onDeleteCancelled(): void {
    this.dealToDelete.set(null);
  }

  onFiltersChange(filters: DealFilters): void {
    this.dealsStore.updateFilters(filters);
  }
}
