import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DealsFacade } from '../../data-access/deals.facade';
import { AddDealFormComponent } from '../../ui/deal-form/add-deal-form/add-deal-form.component';
import { UpdateDealFormComponent } from '../../ui/deal-form/update-deal-form/update-deal-form.component';
import { DealFiltersComponent } from '../../ui/deal-filters/deal-filters.component';
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
    AddDealFormComponent,
    UpdateDealFormComponent,
    DealFiltersComponent,
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
export class DealsPageComponent implements OnInit {
  private readonly facade = inject(DealsFacade);
  private readonly notifications = inject(NotificationService);

  // Store state via facade
  readonly isLoading: Signal<boolean> = this.facade.isLoading;
  readonly isMutating: Signal<boolean> = this.facade.isMutating();
  readonly filteredDeals: Signal<Deal[]> = this.facade.filteredDeals;
  readonly totalDealsCount: Signal<number> = this.facade.totalDealsCount;
  readonly hasFilteredDeals: Signal<boolean> = this.facade.hasFilteredDeals;
  readonly isFiltering: Signal<boolean> = this.facade.isFiltering;

  // UI-only state
  readonly isFormModalOpen: WritableSignal<boolean> = signal(false);
  readonly isEditMode: WritableSignal<boolean> = signal(false);
  readonly editingDealId: WritableSignal<string | null> = signal<string | null>(null);
  readonly dealToDelete: WritableSignal<Deal | null> = signal<Deal | null>(null);

  // Derived
  readonly editingDeal: Signal<Deal | null> = computed(() => {
    const id = this.editingDealId();
    return id ? (this.facade.deals().find((d) => d.id === id) ?? null) : null;
  });
  readonly isDeleteModalOpen: Signal<boolean> = computed(() => this.dealToDelete() !== null);
  readonly deleteModalMessage: Signal<string> = computed(() => {
    const deal = this.dealToDelete();
    return deal
      ? `Are you sure you want to delete "${deal.dealName}"? This action cannot be undone.`
      : '';
  });
  readonly currentNameFilter: Signal<string> = computed(() => this.facade.filters().name ?? '');
  readonly dealsCountLabel: Signal<string> = computed(() =>
    this.totalDealsCount() === 1 ? 'deal' : 'deals'
  );

  constructor() {
    this.facade.addDealSuccess$
      .pipe(takeUntilDestroyed())
      .subscribe(({ deal }) => {
        this.onFormModalClose();
        this.notifications.success(`Deal "${deal.dealName}" created.`);
      });

    this.facade.addDealFailure$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.notifications.error('Failed to create deal.'));

    this.facade.updateDealSuccess$
      .pipe(takeUntilDestroyed())
      .subscribe(({ deal }) => {
        this.onFormModalClose();
        this.notifications.success(`Deal "${deal.dealName}" updated.`);
      });

    this.facade.updateDealFailure$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.notifications.error('Failed to update deal.'));

    this.facade.deleteDealSuccess$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const deal = this.dealToDelete();
        this.dealToDelete.set(null);
        if (deal) this.notifications.success(`Deal "${deal.dealName}" deleted.`);
      });

    this.facade.deleteDealFailure$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.dealToDelete.set(null);
        this.notifications.error('Failed to delete deal.');
      });
  }

  ngOnInit(): void {
    this.facade.loadDeals();
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.editingDealId.set(null);
    this.isFormModalOpen.set(true);
  }

  onDealEdit(deal: Deal): void {
    this.editingDealId.set(deal.id);
    this.isEditMode.set(true);
    this.isFormModalOpen.set(true);
  }

  onFormModalClose(): void {
    this.isFormModalOpen.set(false);
    this.isEditMode.set(false);
    this.editingDealId.set(null);
  }

  onDealAdded(deal: NewDeal): void {
    this.facade.addDeal(deal);
  }

  onDealUpdated(deal: UpdatedDeal): void {
    this.facade.updateDeal(deal);
  }

  onDealDeleteRequest(deal: Deal): void {
    this.dealToDelete.set(deal);
  }

  onDeleteConfirmed(): void {
    const deal = this.dealToDelete();
    if (!deal) return;
    this.facade.deleteDeal(deal.id);
  }

  onDeleteCancelled(): void {
    this.dealToDelete.set(null);
  }

  onFiltersChange(filters: DealFilters): void {
    this.facade.updateFilters(filters);
  }
}
