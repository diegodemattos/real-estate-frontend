import { TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ModalComponent] });
  });

  it('should not render the backdrop when isOpen is false', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal-backdrop')).toBeNull();
  });

  it('should render backdrop and title when open', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', 'Delete deal');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-backdrop')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.modal__title').textContent).toContain(
      'Delete deal'
    );
  });

  it('should emit closed when the close button is clicked', () => {
    const fixture = TestBed.createComponent(ModalComponent);
    fixture.componentRef.setInput('isOpen', true);
    const spy = jest.fn();
    fixture.componentRef.instance.closed.subscribe(spy);
    fixture.detectChanges();

    (
      fixture.nativeElement.querySelector('.modal__close') as HTMLButtonElement
    ).click();
    expect(spy).toHaveBeenCalled();
  });

});
