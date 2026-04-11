import { TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ConfirmModalComponent] });
  });

  function create() {
    const fixture = TestBed.createComponent(ConfirmModalComponent);
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Delete deal');
    fixture.componentRef.setInput('message', 'Are you sure?');
    return fixture;
  }

  it('renders the message inside the open modal', () => {
    const fixture = create();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.confirm__message').textContent
    ).toContain('Are you sure?');
  });

  it('onConfirm emits confirmed when not confirming', () => {
    const fixture = create();
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentRef.instance.confirmed.subscribe(spy);
    fixture.componentRef.instance.onConfirm();
    expect(spy).toHaveBeenCalled();
  });

  it('onConfirm/onCancel are blocked while isConfirming is true', () => {
    const fixture = create();
    fixture.componentRef.setInput('isConfirming', true);
    fixture.detectChanges();
    const confirmSpy = jest.fn();
    const cancelSpy = jest.fn();
    fixture.componentRef.instance.confirmed.subscribe(confirmSpy);
    fixture.componentRef.instance.cancelled.subscribe(cancelSpy);

    fixture.componentRef.instance.onConfirm();
    fixture.componentRef.instance.onCancel();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it('onCancel emits cancelled when not confirming', () => {
    const fixture = create();
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentRef.instance.cancelled.subscribe(spy);
    fixture.componentRef.instance.onCancel();
    expect(spy).toHaveBeenCalled();
  });
});
