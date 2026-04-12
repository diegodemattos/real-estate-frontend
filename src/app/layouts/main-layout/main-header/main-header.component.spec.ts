import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MainHeaderComponent } from './main-header.component';
import { CoreFacade } from '../../../core/state/core.facade';

describe('MainHeaderComponent', () => {
  let facade: { user: ReturnType<typeof signal>; logout: jest.Mock };
  let router: Router;

  beforeEach(() => {
    facade = {
      user: signal({ email: 'admin@termsheet.com' }),
      logout: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [MainHeaderComponent],
      providers: [
        provideRouter([]),
        { provide: CoreFacade, useValue: facade },
      ],
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('displays the authenticated user email', () => {
    const fixture = TestBed.createComponent(MainHeaderComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.header__username').textContent
    ).toContain('admin@termsheet.com');
  });

  it('emits menuToggle when the hamburger button is clicked', () => {
    const fixture = TestBed.createComponent(MainHeaderComponent);
    const spy = jest.fn();
    fixture.componentRef.instance.menuToggle.subscribe(spy);
    fixture.detectChanges();

    (
      fixture.nativeElement.querySelector('.header__toggle') as HTMLButtonElement
    ).click();
    expect(spy).toHaveBeenCalled();
  });

  it('logs the user out and navigates to /public/auth/login', () => {
    const fixture = TestBed.createComponent(MainHeaderComponent);
    fixture.detectChanges();
    (fixture.componentRef.instance as any).onLogout();

    expect(facade.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/public/auth/login']);
  });
});
