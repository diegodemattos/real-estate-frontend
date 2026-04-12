import { TestBed } from '@angular/core/testing';
import { DealsTableComponent } from './deals-table.component';
import { Deal } from '../../../../domain/models/deal.model';

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

  function create(overrideDeals = deals) {
    const fixture = TestBed.createComponent(DealsTableComponent);
    fixture.componentRef.setInput('deals', overrideDeals);
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

  it('applies the correct cap rate badge class in the DOM', () => {
    const capRateDeals: Deal[] = [
      { id: '1', dealName: 'Good', purchasePrice: 1_000_000, address: 'A', noi: 80_000, capRate: 0.07 },
      { id: '2', dealName: 'High', purchasePrice: 1_000_000, address: 'B', noi: 150_000, capRate: 0.15 },
      { id: '3', dealName: 'Low',  purchasePrice: 1_000_000, address: 'C', noi: 30_000,  capRate: 0.03 },
    ];
    const fixture = create(capRateDeals);

    const badges = fixture.nativeElement.querySelectorAll(
      '.table__row td:nth-child(5) span'
    ) as NodeListOf<HTMLElement>;

    expect(badges[0].classList.contains('cap-rate-badge--good')).toBe(true);
    expect(badges[1].classList.contains('cap-rate-badge--high')).toBe(true);
    expect(badges[2].classList.contains('cap-rate-badge--low')).toBe(true);
  });
});
