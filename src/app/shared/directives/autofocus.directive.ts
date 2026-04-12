import { AfterViewInit, Directive, ElementRef, InputSignalWithTransform, booleanAttribute, inject, input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  readonly appAutofocus: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });

  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  ngAfterViewInit(): void {
    if (this.appAutofocus()) {
      setTimeout(() => this.el.nativeElement.focus(), 100)
    }
  }
}
