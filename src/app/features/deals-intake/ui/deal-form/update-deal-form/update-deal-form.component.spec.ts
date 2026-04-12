import { TestBed } from '@angular/core/testing';
import { UpdateDealFormComponent } from './update-deal-form.component';
import { Deal } from '../../../models/deal.model';

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

  it('patches the form with the provided deal on init', () => {
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

  it('previewCapRate computes noi/purchasePrice once both are valid', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    expect(fixture.componentInstance.previewCapRate()).toBeCloseTo(0.08);
  });

  it('submit emits dealUpdated with the id and updated payload', () => {
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

  it('submit is a no-op when the form is invalid', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ dealName: '' });

    const spy = jest.fn();
    fixture.componentInstance.dealUpdated.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('submit is a no-op while isSaving is true', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.componentRef.setInput('isSaving', true);
    fixture.detectChanges();

    const spy = jest.fn();
    fixture.componentInstance.dealUpdated.subscribe(spy);
    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('cancel emits dealCancelled', () => {
    const fixture = TestBed.createComponent(UpdateDealFormComponent);
    fixture.componentRef.setInput('deal', sampleDeal);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.dealCancelled.subscribe(spy);

    fixture.componentInstance.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
