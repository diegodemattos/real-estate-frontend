import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout.component';

describe('AuthLayoutComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthLayoutComponent],
      providers: [provideRouter([])],
    });
  });

  it('should render the hero and form panels with a router outlet', () => {
    const fixture = TestBed.createComponent(AuthLayoutComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.auth-layout__hero')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.auth-layout__form')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
