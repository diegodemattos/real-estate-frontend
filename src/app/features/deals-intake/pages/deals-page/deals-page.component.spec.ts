import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Signal, signal } from '@angular/core';
import { DealsPageComponent } from './deals-page.component';
import { DealsFacade } from '../../data-access/deals.facade';
import { Deal } from '../../../../domain/models/deal.model';
import { NotificationService } from '../../../../shared/services/notification.service';

describe('DealsPageComponent', () => {
  const deal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  const addDealSuccess$ = new Subject<{ deal: Deal }>();
  const addDealFailure$ = new Subject<{ error: string }>();
  const updateDealSuccess$ = new Subject<{ deal: Deal }>();
  const updateDealFailure$ = new Subject<{ error: string }>();
  const deleteDealSuccess$ = new Subject<{ id: string }>();
  const deleteDealFailure$ = new Subject<{ error: string }>();

  let facade: jest.Mocked<Pick<DealsFacade,
    'loadDeals' | 'addDeal' | 'updateDeal' | 'deleteDeal' | 'updateFilters' | 'isMutating'
  >> & {
    deals: Signal<Deal[]>;
    filters: Signal<{ name: string | null; minPrice: number | null; maxPrice: number | null }>;
    filteredDeals: Signal<Deal[]>;
    totalDealsCount: Signal<number>;
    hasFilteredDeals: Signal<boolean>;
    isLoading: Signal<boolean>;
    isFiltering: Signal<boolean>;
    addDealSuccess$: typeof addDealSuccess$;
    addDealFailure$: typeof addDealFailure$;
    updateDealSuccess$: typeof updateDealSuccess$;
    updateDealFailure$: typeof updateDealFailure$;
    deleteDealSuccess$: typeof deleteDealSuccess$;
    deleteDealFailure$: typeof deleteDealFailure$;
  };

  let notifications: { success: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    facade = {
      deals: signal([deal]),
      filters: signal({ name: null, minPrice: null, maxPrice: null }),
      filteredDeals: signal([deal]),
      totalDealsCount: signal(1),
      hasFilteredDeals: signal(true),
      isLoading: signal(false),
      isFiltering: signal(false),
      isMutating: jest.fn().mockReturnValue(signal(false)),
      loadDeals: jest.fn(),
      addDeal: jest.fn(),
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
      updateFilters: jest.fn(),
      addDealSuccess$,
      addDealFailure$,
      updateDealSuccess$,
      updateDealFailure$,
      deleteDealSuccess$,
      deleteDealFailure$,
    };

    notifications = { success: jest.fn(), error: jest.fn() };

    TestBed.configureTestingModule({
      imports: [DealsPageComponent],
      providers: [
        { provide: DealsFacade, useValue: facade },
        { provide: NotificationService, useValue: notifications },
      ],
    });
  });

  function create() {
    const fixture = TestBed.createComponent(DealsPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('calls loadDeals on init', () => {
    create();
    expect(facade.loadDeals).toHaveBeenCalled();
  });

  it('openAddModal opens the form in add mode', () => {
    const fixture = create();
    fixture.componentInstance.openAddModal();
    expect(fixture.componentInstance.isFormModalOpen()).toBe(true);
    expect(fixture.componentInstance.isEditMode()).toBe(false);
    expect(fixture.componentInstance.editingDeal()).toBeNull();
  });

  it('onDealEdit opens the form in edit mode and resolves editingDeal from deals', () => {
    const fixture = create();
    fixture.componentInstance.onDealEdit(deal);
    expect(fixture.componentInstance.isFormModalOpen()).toBe(true);
    expect(fixture.componentInstance.isEditMode()).toBe(true);
    expect(fixture.componentInstance.editingDeal()).toEqual(deal);
  });

  it('onFormModalClose resets all modal state', () => {
    const fixture = create();
    fixture.componentInstance.onDealEdit(deal);
    fixture.componentInstance.onFormModalClose();
    expect(fixture.componentInstance.isFormModalOpen()).toBe(false);
    expect(fixture.componentInstance.isEditMode()).toBe(false);
    expect(fixture.componentInstance.editingDeal()).toBeNull();
  });

  it('onDealAdded calls facade.addDeal', () => {
    const fixture = create();
    const newDeal = { dealName: 'New', purchasePrice: 1, address: 'A', noi: 0 };
    fixture.componentInstance.onDealAdded(newDeal);
    expect(facade.addDeal).toHaveBeenCalledWith(newDeal);
  });

  it('closes modal and shows success when addDealSuccess$ emits', () => {
    const fixture = create();
    fixture.componentInstance.openAddModal();
    addDealSuccess$.next({ deal });
    expect(fixture.componentInstance.isFormModalOpen()).toBe(false);
    expect(notifications.success).toHaveBeenCalledWith(`Deal "${deal.dealName}" created.`);
  });

  it('shows error when addDealFailure$ emits', () => {
    create();
    addDealFailure$.next({ error: 'oops' });
    expect(notifications.error).toHaveBeenCalledWith('Failed to create deal.');
  });

  it('onDealUpdated calls facade.updateDeal', () => {
    const fixture = create();
    const updated = { id: '1', dealName: 'x', purchasePrice: 1, address: 'A', noi: 0 };
    fixture.componentInstance.onDealUpdated(updated);
    expect(facade.updateDeal).toHaveBeenCalledWith(updated);
  });

  it('closes modal and shows success when updateDealSuccess$ emits', () => {
    const fixture = create();
    fixture.componentInstance.onDealEdit(deal);
    updateDealSuccess$.next({ deal });
    expect(fixture.componentInstance.isFormModalOpen()).toBe(false);
    expect(notifications.success).toHaveBeenCalledWith(`Deal "${deal.dealName}" updated.`);
  });

  it('delete flow: request → confirm → facade.deleteDeal called', () => {
    const fixture = create();
    fixture.componentInstance.onDealDeleteRequest(deal);
    expect(fixture.componentInstance.isDeleteModalOpen()).toBe(true);
    expect(fixture.componentInstance.deleteModalMessage()).toContain('Sunset');

    fixture.componentInstance.onDeleteConfirmed();
    expect(facade.deleteDeal).toHaveBeenCalledWith(deal.id);
  });

  it('closes delete modal and shows success when deleteDealSuccess$ emits', () => {
    const fixture = create();
    fixture.componentInstance.onDealDeleteRequest(deal);
    deleteDealSuccess$.next({ id: deal.id });
    expect(fixture.componentInstance.dealToDelete()).toBeNull();
    expect(notifications.success).toHaveBeenCalledWith(`Deal "${deal.dealName}" deleted.`);
  });

  it('closes delete modal and shows error when deleteDealFailure$ emits', () => {
    const fixture = create();
    fixture.componentInstance.onDealDeleteRequest(deal);
    deleteDealFailure$.next({ error: 'oops' });
    expect(fixture.componentInstance.dealToDelete()).toBeNull();
    expect(notifications.error).toHaveBeenCalledWith('Failed to delete deal.');
  });

  it('onDeleteCancelled clears dealToDelete', () => {
    const fixture = create();
    fixture.componentInstance.onDealDeleteRequest(deal);
    fixture.componentInstance.onDeleteCancelled();
    expect(fixture.componentInstance.dealToDelete()).toBeNull();
  });

  it('onFiltersChange calls facade.updateFilters', () => {
    const fixture = create();
    const filters = { name: 'sun', minPrice: null, maxPrice: null };
    fixture.componentInstance.onFiltersChange(filters);
    expect(facade.updateFilters).toHaveBeenCalledWith(filters);
  });
});
