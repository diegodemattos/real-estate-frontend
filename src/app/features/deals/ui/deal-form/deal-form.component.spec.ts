import { TestBed } from '@angular/core/testing';
import { DealFormComponent } from './deal-form.component';
import { Deal } from '../../models/deal.model';

describe('DealFormComponent', () => {
  const sampleDeal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DealFormComponent] });
  });

  it('starts in add mode when no deal input is provided', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isEditMode()).toBe(false);
    expect(fixture.componentInstance.submitLabel()).toBe('Add Deal');
    expect(fixture.componentInstance.submitLoadingLabel()).toBe('Adding...');
  });

  it('patches the form when a deal input is provided (edit mode)', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();

    expect(fixture.componentInstance.isEditMode()).toBe(true);
    expect(fixture.componentInstance.submitLabel()).toBe('Update Deal');
    expect(fixture.componentInstance.form.value).toEqual({
      dealName: 'Sunset',
      purchasePrice: 1_000_000,
      address: 'A',
      noi: 80_000,
    });
  });

  it('previewCapRate computes noi/purchasePrice once both are valid', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.previewCapRate()).toBeNull();

    fixture.componentInstance.form.patchValue({
      purchasePrice: 1_000_000,
      noi: 80_000,
    });
    expect(fixture.componentInstance.previewCapRate()).toBeCloseTo(0.08);
  });

  it('submit emits dealAdded with the payload when in add mode and valid', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
    });

    const addedSpy = jest.fn();
    const updatedSpy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(addedSpy);
    fixture.componentInstance.dealUpdated.subscribe(updatedSpy);

    fixture.componentInstance.submit();
    expect(addedSpy).toHaveBeenCalledWith({
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
    });
    expect(updatedSpy).not.toHaveBeenCalled();
  });

  it('submit emits dealUpdated with the id in edit mode', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ dealName: 'Renamed' });

    const updatedSpy = jest.fn();
    fixture.componentInstance.dealUpdated.subscribe(updatedSpy);

    fixture.componentInstance.submit();
    expect(updatedSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', dealName: 'Renamed' })
    );
  });

  it('submit is a no-op when the form is invalid', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.detectChanges();

    const addedSpy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(addedSpy);
    fixture.componentInstance.submit();
    expect(addedSpy).not.toHaveBeenCalled();
  });

  it('submit is a no-op while isSaving is true', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
    });

    const addedSpy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(addedSpy);
    fixture.componentInstance.submit();
    expect(addedSpy).not.toHaveBeenCalled();
  });

  it('cancel emits dealCancelled', () => {
    const fixture = TestBed.createComponent(DealFormComponent);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.dealCancelled.subscribe(spy);

    fixture.componentInstance.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
