import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MainMenuComponent } from './main-menu.component';

describe('MainMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainMenuComponent],
      providers: [provideRouter([])],
    });
  });

  it('should expose Deals Intake and Deals Analysis nav items pointing at /main/*', () => {
    const fixture = TestBed.createComponent(MainMenuComponent);
    fixture.detectChanges();
    const items = fixture.componentInstance.items;
    expect(items.map((i) => i.route)).toEqual([
      '/main/deals-intake',
      '/main/deals-analysis',
    ]);
  });

  it('should toggle the menu-host--open class from the isOpen input', () => {
    const fixture = TestBed.createComponent(MainMenuComponent);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains(
        'menu-host--open'
      )
    ).toBe(true);
  });

  it('should render one link per nav item', () => {
    const fixture = TestBed.createComponent(MainMenuComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.menu__link').length).toBe(2);
  });
});
