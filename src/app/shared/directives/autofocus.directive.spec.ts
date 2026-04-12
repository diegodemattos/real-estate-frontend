import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  standalone: true,
  imports: [AutofocusDirective],
  template: `<input appAutofocus />`,
})
class HostEnabledComponent {}

@Component({
  standalone: true,
  imports: [AutofocusDirective],
  template: `<input [appAutofocus]="false" />`,
})
class HostDisabledComponent {}

describe('AutofocusDirective', () => {
  it('should be attached to the element and receive true by default', () => {
    TestBed.configureTestingModule({ imports: [HostEnabledComponent] });
    const fixture = TestBed.createComponent(HostEnabledComponent);
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.directive(AutofocusDirective));
    expect(debugEl).toBeTruthy();
    expect(debugEl.nativeElement.tagName).toBe('INPUT');

    const directive = debugEl.injector.get(AutofocusDirective);
    expect(directive.appAutofocus()).toBe(true);
  });

  it('should receive false when bound to false', () => {
    TestBed.configureTestingModule({ imports: [HostDisabledComponent] });
    const fixture = TestBed.createComponent(HostDisabledComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement
      .query(By.directive(AutofocusDirective))
      .injector.get(AutofocusDirective);
    expect(directive.appAutofocus()).toBe(false);
  });
});
