import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { CoreFacade } from '../../core/state/core.facade';

describe('MainLayoutComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideRouter([]),
        {
          provide: CoreFacade,
          useValue: { user: signal(null), logout: jest.fn() },
        },
      ],
    });

    jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });

  it('should start with the menu closed', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
    expect((fixture.componentInstance as any).isMenuOpen()).toBe(false);
  });

  it('should flip the menu state on toggleMenu', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
    const instance = fixture.componentInstance as any;

    instance.toggleMenu();
    expect(instance.isMenuOpen()).toBe(true);

    instance.toggleMenu();
    expect(instance.isMenuOpen()).toBe(false);
  });

  it('should force the menu closed on closeMenu', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
    const instance = fixture.componentInstance as any;

    instance.toggleMenu();
    instance.closeMenu();
    expect(instance.isMenuOpen()).toBe(false);
  });

  it('should render the backdrop only when the menu is open', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.main-layout__backdrop')
    ).toBeNull();

    (fixture.componentInstance as any).toggleMenu();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.main-layout__backdrop')
    ).toBeTruthy();
  });
});
