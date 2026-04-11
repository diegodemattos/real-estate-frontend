import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AlertComponent] });
  });

  it('defaults to the info variant', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert--info')).toBeTruthy();
  });

  it('applies the selected variant class', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert--error')).toBeTruthy();
  });

  it('has role="alert" on the host', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('role')).toBe(
      'alert'
    );
  });
});
