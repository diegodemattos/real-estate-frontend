import { TestBed } from '@angular/core/testing';
import { AddDealFormComponent } from './add-deal-form.component';

describe('AddDealFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AddDealFormComponent] });
  });

  it('should start with an empty invalid form', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isFormValid()).toBe(false);
  });

  it('should compute noi/purchasePrice in previewCapRate once both are valid', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.previewCapRate()).toBeNull();

    fixture.componentInstance.form.patchValue({ purchasePrice: 1_000_000, noi: 80_000 });
    expect(fixture.componentInstance.previewCapRate()).toBeCloseTo(0.08);
  });

  it('should emit dealAdded with the payload when the form is valid on submit', () => {
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

  it('should be a no-op on submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();

    const spy = jest.fn();
    fixture.componentInstance.dealAdded.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should be a no-op on submit while isSaving is true', () => {
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

  it('should emit dealCancelled on cancel', () => {
    const fixture = TestBed.createComponent(AddDealFormComponent);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.dealCancelled.subscribe(spy);

    fixture.componentInstance.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
