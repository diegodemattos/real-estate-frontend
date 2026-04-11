import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ButtonComponent] });
  });

  function create() {
    const fixture = TestBed.createComponent(ButtonComponent);
    return { fixture, button: () => fixture.nativeElement.querySelector('button') as HTMLButtonElement };
  }

  it('renders projected content as the label', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.nativeElement.querySelector('button')!.textContent = '';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
  });

  it('applies the variant class matching the variant input', () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(button().classList.contains('button--danger')).toBe(true);
  });

  it('emits the action output when clicked', () => {
    const { fixture, button } = create();
    const spy = jest.fn();
    fixture.componentRef.instance.action.subscribe(spy);
    fixture.detectChanges();
    button().click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit action when disabled', () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('disabled', true);
    const spy = jest.fn();
    fixture.componentRef.instance.action.subscribe(spy);
    fixture.detectChanges();
    button().click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not emit action and shows spinner when loading', () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingLabel', 'Saving...');
    const spy = jest.fn();
    fixture.componentRef.instance.action.subscribe(spy);
    fixture.detectChanges();

    expect(button().disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('.button__spinner')).toBeTruthy();
    expect(button().textContent).toContain('Saving...');

    button().click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('toggles the full-width host class from the full input', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('full', true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).classList.contains('button-host--full')
    ).toBe(true);
  });

  it('forwards the type attribute to the underlying button', () => {
    const { fixture, button } = create();
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(button().type).toBe('submit');
  });
});
