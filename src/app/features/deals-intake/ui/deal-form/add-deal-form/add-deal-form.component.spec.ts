import { TestBed } from '@angular/core/testing';
import { AddDealFormComponent } from './add-deal-form.component';

describe('AddDealFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AddDealFormComponent] });
  });

  it('starts with an empty invalid form', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isFormValid()).toBe(false);
  });

  it('previewCapRate computes noi/purchasePrice once both are valid', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.previewCapRate()).toBeNull();

    fixture.componentInstance.form.patchValue({ purchasePrice: 1_000_000, noi: 80_000 });
    expect(fixture.componentInstance.previewCapRate()).toBeCloseTo(0.08);
  });

  it('submit emits dealAdded with the payload when the form is valid', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
    });

    const spy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).toHaveBeenCalledWith({
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
    });
  });

  it('submit is a no-op when the form is invalid', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();

    const spy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('submit is a no-op while isSaving is true', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({
      dealName: 'New',
      purchasePrice: 500_000,
      address: 'C',
      noi: 40_000,
    });

    const spy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('cancel emits dealCancelled', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.dealCancelled.subscribe(spy);

    fixture.componentInstance.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
