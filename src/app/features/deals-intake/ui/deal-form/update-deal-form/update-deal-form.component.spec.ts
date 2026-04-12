import { TestBed } from '@angular/core/testing';
import { UpdateDealFormComponent } from './update-deal-form.component';
import { Deal } from '../../../../../domain/models/deal.model';

describe('UpdateDealFormComponent', () => {
  const sampleDeal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UpdateDealFormComponent] });
  });

  it('should patch the form with the provided deal on init', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.value).toEqual({
      dealName: 'Sunset',
      purchasePrice: 1_000_000,
      address: 'A',
      noi: 80_000,
    });
  });

  it('should compute noi/purchasePrice in previewCapRate once both are valid', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    expect(fixture.componentInstance.previewCapRate()).toBeCloseTo(0.08);
  });

  it('should emit dealUpdated with the id and updated payload on submit', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ dealName: 'Renamed' });

    const spy = jest.fn();
    fixture.componentInstance.dealUpdated.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1', dealName: 'Renamed' })
    );
  });

  it('should be a no-op on submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ dealName: '' });

    const spy = jest.fn();
    fixture.componentInstance.dealUpdated.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should be a no-op on submit while isSaving is true', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();

    const spy = jest.fn();
    fixture.componentInstance.dealUpdated.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit dealCancelled on cancel', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.dealCancelled.subscribe(spy);

    fixture.componentInstance.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
