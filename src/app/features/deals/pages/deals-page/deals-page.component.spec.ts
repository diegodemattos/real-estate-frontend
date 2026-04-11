import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DealsPageComponent } from './deals-page.component';
import { DealsStore } from '../../data-access/deals.store';
import { Deal } from '../../models/deal.model';

describe('DealsPageComponent', () => {
  const deal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  let dealsStore: {
    filters: any;
    isLoading: any;
    isMutating: any;
    isFiltering: any;
    filteredDeals: any;
    hasFilteredDeals: any;
    totalDealsCount: any;
    loadDeal: jest.Mock;
    addDeal: jest.Mock;
    updateDeal: jest.Mock;
    deleteDeal: jest.Mock;
    updateFilters: jest.Mock;
  };

  beforeEach(() => {
    dealsStore = {
      filters: signal({ name: '', priceMin: null, priceMax: null }),
      isLoading: signal(false),
      isMutating: signal(false),
      isFiltering: signal(false),
      filteredDeals: signal([deal]),
      hasFilteredDeals: signal(true),
      totalDealsCount: signal(1),
      loadDeal: jest.fn().mockReturnValue(of(deal)),
      addDeal: jest.fn().mockReturnValue(of(deal)),
      updateDeal: jest.fn().mockReturnValue(of(deal)),
      deleteDeal: jest.fn().mockReturnValue(of(void 0)),
      updateFilters: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DealsPageComponent],
      providers: [{ provide: DealsStore, useValue: dealsStore }],
    });
  });

  function create() {
    const fixture = TestBed.createComponent(DealsPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('openAddModal resets state and shows the form modal in add mode', () => {
    const fixture = create();
    fixture.componentInstance.openAddModal();
    expect(fixture.componentInstance.isFormModalOpen()).toBe(true);
    expect(fixture.componentInstance.isEditMode()).toBe(false);
    expect(fixture.componentInstance.editingDeal()).toBeNull();
  });

  it('onDealEdit fetches the deal and populates editingDeal', () => {
    const fixture = create();
    fixture.componentInstance.onDealEdit(deal);

    expect(dealsStore.loadDeal).toHaveBeenCalledWith('1');
    expect(fixture.componentInstance.isEditMode()).toBe(true);
    expect(fixture.componentInstance.editingDeal()).toEqual(deal);
    expect(fixture.componentInstance.isLoadingDeal()).toBe(false);
  });

  it('onDealEdit closes the modal when loadDeal errors', () => {
    dealsStore.loadDeal.mockReturnValue(throwError(() => new Error('x')));
    const fixture = create();
    fixture.componentInstance.onDealEdit(deal);

    expect(fixture.componentInstance.isFormModalOpen()).toBe(false);
    expect(fixture.componentInstance.isLoadingDeal()).toBe(false);
  });

  it('onDealAdded subscribes to addDeal and closes the modal on success', () => {
    const fixture = create();
    fixture.componentInstance.openAddModal();
    fixture.componentInstance.onDealAdded({
      dealName: 'New',
      purchasePrice: 1,
      address: 'A',
      noi: 0,
    });
    expect(dealsStore.addDeal).toHaveBeenCalled();
    expect(fixture.componentInstance.isFormModalOpen()).toBe(false);
  });

  it('onDealUpdated subscribes to updateDeal and closes the modal on success', () => {
    const fixture = create();
    fixture.componentInstance.onDealUpdated({
      id: '1',
      dealName: 'x',
      purchasePrice: 1,
      address: 'A',
      noi: 0,
    });
    expect(dealsStore.updateDeal).toHaveBeenCalled();
    expect(fixture.componentInstance.isFormModalOpen()).toBe(false);
  });

  it('delete flow: request → confirm → deleteDeal called → modal closed', () => {
    const fixture = create();

    fixture.componentInstance.onDealDeleteRequest(deal);
    expect(fixture.componentInstance.isDeleteModalOpen()).toBe(true);
    expect(fixture.componentInstance.deleteModalMessage()).toContain('Sunset');

    fixture.componentInstance.onDeleteConfirmed();
    expect(dealsStore.deleteDeal).toHaveBeenCalledWith('1');
    expect(fixture.componentInstance.dealToDelete()).toBeNull();
  });

  it('onDeleteCancelled clears the dealToDelete signal', () => {
    const fixture = create();
    fixture.componentInstance.onDealDeleteRequest(deal);
    fixture.componentInstance.onDeleteCancelled();
    expect(fixture.componentInstance.dealToDelete()).toBeNull();
  });

  it('onFiltersChange delegates to the store', () => {
    const fixture = create();
    const filters = { name: 'sun', priceMin: null, priceMax: null };
    fixture.componentInstance.onFiltersChange(filters);
    expect(dealsStore.updateFilters).toHaveBeenCalledWith(filters);
  });
});
