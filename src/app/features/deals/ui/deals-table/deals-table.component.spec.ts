import { TestBed } from '@angular/core/testing';
import { DealsTableComponent } from './deals-table.component';
import { Deal } from '../../models/deal.model';

describe('DealsTableComponent', () => {
  const deals: Deal[] = [
    {
      id: '1',
      dealName: 'Sunset',
      purchasePrice: 1_000_000,
      address: 'A',
      noi: 80_000,
      capRate: 0.08,
    },
    {
      id: '2',
      dealName: 'Harbor',
      purchasePrice: 2_000_000,
      address: 'B',
      noi: 160_000,
      capRate: 0.08,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DealsTableComponent] });
  });

  function create() {
    const fixture = TestBed.createComponent(DealsTableComponent);
    fixture.componentRef.setInput('deals', deals);
    fixture.detectChanges();
    return fixture;
  }

  it('renders one row per deal', () => {
    const fixture = create();
    expect(fixture.nativeElement.querySelectorAll('.table__row').length).toBe(2);
  });

  it('emits dealEdit when the Edit button is clicked', () => {
    const fixture = create();
    const spy = jest.fn();
    fixture.componentInstance.dealEdit.subscribe(spy);

    const editBtn = fixture.nativeElement.querySelector(
      '.action-btn--edit'
    ) as HTMLButtonElement;
    editBtn.click();
    expect(spy).toHaveBeenCalledWith(deals[0]);
  });

  it('emits dealDelete when the Delete button is clicked', () => {
    const fixture = create();
    const spy = jest.fn();
    fixture.componentInstance.dealDelete.subscribe(spy);

    const deleteBtn = fixture.nativeElement.querySelector(
      '.action-btn--delete'
    ) as HTMLButtonElement;
    deleteBtn.click();
    expect(spy).toHaveBeenCalledWith(deals[0]);
  });

  it('classifies cap rates into good / high / low buckets', () => {
    const fixture = create();
    const c = fixture.componentInstance;

    expect(c.isGoodCapRate(0.07)).toBe(true);
    expect(c.isGoodCapRate(0.05)).toBe(true);
    expect(c.isGoodCapRate(0.12)).toBe(true);

    expect(c.isHighCapRate(0.13)).toBe(true);
    expect(c.isHighCapRate(0.1)).toBe(false);

    expect(c.isLowCapRate(0.04)).toBe(true);
    expect(c.isLowCapRate(0)).toBe(false);
  });
});
