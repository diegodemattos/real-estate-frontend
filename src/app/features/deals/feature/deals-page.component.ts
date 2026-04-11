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
import { Deal, DealFilters, NewDeal, UpdatedDeal } from '../models/deal.model';

@Component({
  selector: 'app-deals-page',
  standalone: true,
  imports: [
    DealFiltersComponent,
    DealFormComponent,
    DealsTableComponent,
    EmptyStateComponent,
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
            <h2 class="section__title">Deals</h2>
            @if (dealsStore.isFiltering()) {
              <span class="section__count">
                {{ dealsStore.filteredDeals().length }} of
                {{ dealsStore.totalDealsCount() }} shown
              </span>
            }
          </div>

          @if (dealsStore.hasFilteredDeals()) {
            <app-deals-table
              [deals]="dealsStore.filteredDeals()"
              [nameFilter]="currentNameFilter()"
              [editingDealId]="editingDeal()?.id ?? null"
              (dealEdit)="onDealEdit($event)"
              (dealDelete)="onDealDelete($event)"
            />
          } @else {
            @if (dealsStore.isFiltering()) {
              <app-empty-state
                message="No deals match your current filters. Try adjusting your search."
              />
            } @else {
              <app-empty-state
                message="No deals yet. Add your first deal below."
              />
            }
          }
        </section>

        <section class="section">
          <app-deal-form
            [deal]="editingDeal()"
            (dealAdded)="onDealAdded($event)"
            (dealUpdated)="onDealUpdated($event)"
            (dealCancelled)="onEditCancelled()"
          />
        </section>
      </main>
    </div>
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
        padding: 0.5rem 1rem;
        font-size: var(--font-size-sm);
        font-weight: 500;
        border-radius: var(--radius-md);
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease;
      }

      .btn--ghost {
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
    `,
  ],
})
export class DealsPageComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly dealsStore = inject(DealsStore);
  private readonly router = inject(Router);

  /** The deal currently being edited, or null when in add mode. */
  readonly editingDeal = signal<Deal | null>(null);

  readonly currentNameFilter = computed(() => this.dealsStore.filters().name);

  onFiltersChange(filters: DealFilters): void {
    this.dealsStore.updateFilters(filters);
  }

  onDealAdded(newDeal: NewDeal): void {
    this.dealsStore.addDeal(newDeal);
  }

  onDealEdit(deal: Deal): void {
    this.editingDeal.set(deal);
  }

  onDealUpdated(updatedDeal: UpdatedDeal): void {
    this.dealsStore.updateDeal(updatedDeal);
    this.editingDeal.set(null);
  }

  onEditCancelled(): void {
    this.editingDeal.set(null);
  }

  onDealDelete(id: string): void {
    if (this.editingDeal()?.id === id) {
      this.editingDeal.set(null);
    }
    this.dealsStore.deleteDeal(id);
  }

  onLogout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
