import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginFormComponent],
      providers: [provideRouter([])],
    });
  });

  function create() {
    const fixture = TestBed.createComponent(LoginFormComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('should start with the seeded admin credentials', () => {
    const fixture = create();
    expect(fixture.componentInstance.form.value).toEqual({
      email: 'admin@termsheet.com',
      password: 'Ts@123456',
    });
  });

  it('should emit login with the form value when submitted with valid input', () => {
    const fixture = create();
    const spy = jest.fn();
    fixture.componentInstance.login.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).toHaveBeenCalledWith({
      email: 'admin@termsheet.com',
      password: 'Ts@123456',
    });
  });

  it('should not emit when the form is invalid', () => {
    const fixture = create();
    fixture.componentInstance.form.patchValue({ email: '', password: '' });
    const spy = jest.fn();
    fixture.componentInstance.login.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit while isLoading is true', () => {
    const fixture = create();
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.login.subscribe(spy);

    fixture.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
  });
});
