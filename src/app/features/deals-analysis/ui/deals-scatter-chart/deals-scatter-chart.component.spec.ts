import { TestBed } from '@angular/core/testing';
import { DealsScatterChartComponent } from './deals-scatter-chart.component';
import { Deal } from '../../../../domain/models/deal.model';

describe('DealsScatterChartComponent', () => {
  const deals: Deal[] = [
    { id: '1', dealName: 'Sunset', purchasePrice: 2_500_000, address: 'A', noi: 175_000, capRate: 0.07 },
    { id: '2', dealName: 'Downtown', purchasePrice: 8_000_000, address: 'B', noi: 640_000, capRate: 0.08 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [DealsScatterChartComponent] });
  });

  it('should render nothing when deals is empty', () => {
    const fixture = TestBed.createComponent(DealsScatterChartComponent);
    fixture.componentRef.setInput('deals', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(fixture.nativeElement.querySelector('.legend-table')).toBeNull();
  });

  it('should render an svg with numbered data points', () => {
    const fixture = TestBed.createComponent(DealsScatterChartComponent);
    fixture.componentRef.setInput('deals', deals);
    fixture.detectChanges();

    const circles = fixture.nativeElement.querySelectorAll('.chart__point');
    expect(circles.length).toBe(2);

    const labels = fixture.nativeElement.querySelectorAll('.chart__point-label');
    expect(labels[0].textContent.trim()).toBe('1');
    expect(labels[1].textContent.trim()).toBe('2');
  });

  it('should have a tooltip with the deal name on each point', () => {
    const fixture = TestBed.createComponent(DealsScatterChartComponent);
    fixture.componentRef.setInput('deals', deals);
    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('.chart__point title');
    expect(titles[0].textContent).toContain('Sunset');
    expect(titles[1].textContent).toContain('Downtown');
  });

  it('should render the color legend with cap rate ranges', () => {
    const fixture = TestBed.createComponent(DealsScatterChartComponent);
    fixture.componentRef.setInput('deals', deals);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.color-legend__item');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Good');
    expect(items[1].textContent).toContain('High');
    expect(items[2].textContent).toContain('Low');
  });

  it('should render a reference table with deal names', () => {
    const fixture = TestBed.createComponent(DealsScatterChartComponent);
    fixture.componentRef.setInput('deals', deals);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.legend-table__row');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Sunset');
    expect(rows[1].textContent).toContain('Downtown');
  });

  it('should render axis titles', () => {
    const fixture = TestBed.createComponent(DealsScatterChartComponent);
    fixture.componentRef.setInput('deals', deals);
    fixture.detectChanges();

    const axisTitles = fixture.nativeElement.querySelectorAll('.chart__axis-title');
    const texts = Array.from(axisTitles).map((el: any) => el.textContent.trim());
    expect(texts).toContain('Purchase Price');
    expect(texts).toContain('Cap Rate');
  });
});
