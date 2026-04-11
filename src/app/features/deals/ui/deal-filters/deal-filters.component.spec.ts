import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DealFiltersComponent } from './deal-filters.component';

describe('DealFiltersComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DealFiltersComponent] });
  });

  it('emits filtersChange with normalized values after debounce', fakeAsync(() => {
    const fixture = TestBed.createComponent(DealFiltersComponent);
    const spy = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(spy);
    fixture.detectChanges();
    spy.mockClear();

    fixture.componentInstance.form.patchValue({
      name: 'sunset',
      priceMin: 1_000_000,
      priceMax: 5_000_000,
    });

    tick(299);
    expect(spy).not.toHaveBeenCalled();

    tick(1);
    expect(spy).toHaveBeenLastCalledWith({
      name: 'sunset',
      priceMin: 1_000_000,
      priceMax: 5_000_000,
    });
  }));

  it('coalesces rapid changes into a single emission (debounceTime)', fakeAsync(() => {
    const fixture = TestBed.createComponent(DealFiltersComponent);
    const spy = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(spy);
    fixture.detectChanges();
    spy.mockClear();

    fixture.componentInstance.form.patchValue({ name: 's' });
    tick(100);
    fixture.componentInstance.form.patchValue({ name: 'su' });
    tick(100);
    fixture.componentInstance.form.patchValue({ name: 'sun' });
    tick(300);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith({
      name: 'sun',
      priceMin: null,
      priceMax: null,
    });
  }));

  it('skips re-emission when normalized filters are unchanged (distinctUntilChanged)', fakeAsync(() => {
    const fixture = TestBed.createComponent(DealFiltersComponent);
    const spy = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(spy);
    fixture.detectChanges();
    spy.mockClear();

    fixture.componentInstance.form.patchValue({ name: 'abc' });
    tick(300);
    expect(spy).toHaveBeenCalledTimes(1);

    fixture.componentInstance.form.patchValue({ name: 'abc' });
    tick(300);
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('onClear resets all fields and emits an empty filter set', fakeAsync(() => {
    const fixture = TestBed.createComponent(DealFiltersComponent);
    const spy = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(spy);
    fixture.detectChanges();

    fixture.componentInstance.form.patchValue({
      name: 'abc',
      priceMin: 1,
      priceMax: 9,
    });
    tick(300);
    spy.mockClear();

    fixture.componentInstance.onClear();
    tick(300);

    expect(spy).toHaveBeenLastCalledWith({
      name: '',
      priceMin: null,
      priceMax: null,
    });
  }));
});
