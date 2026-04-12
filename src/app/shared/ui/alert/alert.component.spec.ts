import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AlertComponent] });
  });

  it('should default to the info variant', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert--info')).toBeTruthy();
  });

  it('should apply the selected variant class', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert--error')).toBeTruthy();
  });

  it('should have role="alert" on the host', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('role')).toBe(
      'alert'
    );
  });
});
