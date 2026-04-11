import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../auth/data-access/auth.store';
import { DealsStore } from '../data-access/deals.store';
import { DealFiltersComponent } from '../ui/deal-filters.component';
import { DealFormComponent } from '../ui/deal-form.component';
import { DealsTableComponent } from '../ui/deals-table.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state.component';
import { ModalComponent } from '../../../shared/ui/modal.component';
import { ConfirmModalComponent } from '../../../shared/ui/confirm-modal.component';
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';

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
  template: `
    <div class="page">
      <header class="page-header">
        <div class="page-header__inner">
          <div class="page-header__brand">
            <h1 class="page-header__title">Real Estate Portal</h1>
            <span class="page-header__count">
              {{ dealsStore.totalDealsCount() }}
              {{ dealsStore.totalDealsCount() === 1 ? 'deal' : 'deals' }}
            </span>
          </div>

          <div class="page-header__user">
            <span class="page-header__username">
              {{ authStore.user()?.username }}
            </span>
            <button class="btn btn--ghost" type="button" (click)="onLogout()">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="page-content">
        <section class="section">
          <h2 class="section__title">Filters</h2>
          <app-deal-filters (filtersChange)="onFiltersChange($event)" />
        </section>

        <section class="section">
          <div class="section__header">
            <div class="section__header-left">
              <h2 class="section__title">Deals</h2>
              @if (dealsStore.isFiltering()) {
                <span class="section__count">
                  {{ dealsStore.filteredDeals().length }} of
                  {{ dealsStore.totalDealsCount() }} shown
                </span>
              }
            </div>
            <button class="btn btn--add" type="button" (click)="openAddModal()">
              + Add Deal
            </button>
          </div>

          @if (dealsStore.hasFilteredDeals()) {
            <app-deals-table
              [deals]="dealsStore.filteredDeals()"
              [nameFilter]="currentNameFilter()"
              [editingDealId]="editingDeal()?.id ?? null"
              (dealEdit)="onDealEdit($event)"
              (dealDelete)="onDealDeleteRequest($event)"
            />
          } @else {
            @if (dealsStore.isFiltering()) {
              <app-empty-state
                message="No deals match your current filters. Try adjusting your search."
              />
            } @else {
              <app-empty-state
                message="No deals yet. Click '+ Add Deal' to get started."
              />
            }
          }
        </section>
      </main>
    </div>

    <!-- Add / Edit modal -->
    <app-modal
      [isOpen]="isFormModalOpen()"
      [title]="formModalTitle()"
      (closed)="onFormModalClose()"
    >
      <app-deal-form
        [deal]="editingDeal()"
        (dealAdded)="onDealAdded($event)"
        (dealUpdated)="onDealUpdated($event)"
        (dealCancelled)="onFormModalClose()"
      />
    </app-modal>

    <!-- Delete confirmation modal -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen()"
      title="Delete Deal"
      [message]="deleteModalMessage()"
      confirmLabel="Delete"
      cancelLabel="Cancel"
      (confirmed)="onDeleteConfirmed()"
      (cancelled)="onDeleteCancelled()"
    />
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        background-color: var(--color-bg);
      }

      .page-header {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: var(--color-primary);
        border-bottom: 1px solid rgb(255 255 255 / 0.08);
      }

      .page-header__inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .page-header__brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .page-header__title {
        font-size: var(--font-size-lg);
        font-weight: 700;
        color: var(--color-surface);
      }

      .page-header__count {
        font-size: var(--font-size-xs);
        color: rgb(255 255 255 / 0.55);
        background-color: rgb(255 255 255 / 0.08);
        padding: 0.2rem 0.625rem;
        border-radius: 9999px;
      }

      .page-header__user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .page-header__username {
        font-size: var(--font-size-sm);
        color: rgb(255 255 255 / 0.7);
      }

      .page-content {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .section__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .section__header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .section__title {
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text);
      }

      .section__count {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-sm);
        font-weight: 500;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease;
      }

      .btn--ghost {
        padding: 0.5rem 1rem;
        background-color: rgb(255 255 255 / 0.1);
        color: var(--color-surface);

        &:hover {
          background-color: rgb(255 255 255 / 0.18);
        }

        &:focus-visible {
          outline: 2px solid rgb(255 255 255 / 0.5);
          outline-offset: 2px;
        }
      }

      .btn--add {
        padding: 0.5rem 1.125rem;
        background-color: var(--color-secondary);
        color: var(--color-surface);

        &:hover {
          background-color: var(--color-secondary-hover);
        }

        &:focus-visible {
          outline: 2px solid var(--color-secondary);
          outline-offset: 2px;
        }
      }
    `,
  ],
})
export class DealsPageComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly dealsStore = inject(DealsStore);
  private readonly router = inject(Router);

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

  // — Auth —

  onFiltersChange(filters: DealFilters): void {
    this.dealsStore.updateFilters(filters);
  }

  onLogout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
