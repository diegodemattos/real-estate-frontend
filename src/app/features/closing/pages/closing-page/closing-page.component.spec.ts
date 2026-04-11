import { TestBed } from '@angular/core/testing';
import { ClosingPageComponent } from './closing-page.component';

describe('ClosingPageComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClosingPageComponent] });
  });

  it('renders the "Em construção" placeholder message', () => {
    const fixture = TestBed.createComponent(ClosingPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Em construção');
  });
});
