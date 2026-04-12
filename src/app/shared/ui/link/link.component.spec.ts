import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LinkComponent],
      providers: [provideRouter([])],
    });
  });

  it('should render an anchor pointing at the `to` input', () => {
    const fixture = TestBed.createComponent(LinkComponent);
    fixture.componentRef.setInput('to', '/public/login');
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/public/login');
  });
});
