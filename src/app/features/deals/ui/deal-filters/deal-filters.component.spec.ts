import { TestBed } from '@angular/core/testing';
import { DealFiltersComponent } from './deal-filters.component';

describe('DealFiltersComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DealFiltersComponent] });
  });

  it('emits filtersChange with normalized values on valueChanges', () => {
    const fixture = TestBed.createComponent(DealFiltersComponent);
    const spy = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(spy);
    fixture.detectChanges();

    fixture.componentInstance.form.patchValue({
      name: 'sunset',
      priceMin: 1_000_000,
      priceMax: 5_000_000,
    });

    expect(spy).toHaveBeenLastCalledWith({
      name: 'sunset',
      priceMin: 1_000_000,
      priceMax: 5_000_000,
    });
  });

  it('onClear resets all fields and emits an empty filter set', () => {
    const fixture = TestBed.createComponent(DealFiltersComponent);
    const spy = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(spy);
    fixture.detectChanges();

    fixture.componentInstance.form.patchValue({
      name: 'abc',
      priceMin: 1,
      priceMax: 9,
    });
    spy.mockClear();

    fixture.componentInstance.onClear();
    expect(spy).toHaveBeenLastCalledWith({
      name: '',
      priceMin: null,
      priceMax: null,
    });
  });
});
