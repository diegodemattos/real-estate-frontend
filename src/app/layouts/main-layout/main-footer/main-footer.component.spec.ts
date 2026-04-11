import { TestBed } from '@angular/core/testing';
import { MainFooterComponent } from './main-footer.component';

describe('MainFooterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MainFooterComponent] });
  });

  it('exposes the current year', () => {
    const fixture = TestBed.createComponent(MainFooterComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.currentYear).toBe(new Date().getFullYear());
  });
});
