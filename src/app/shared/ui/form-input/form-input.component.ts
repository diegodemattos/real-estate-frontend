import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  Signal,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { EyeIconComponent } from '../../icons/eye-icon/eye-icon.component';
import { EyeOffIconComponent } from '../../icons/eye-off-icon/eye-off-icon.component';

type InputType = 'text' | 'email' | 'password' | 'number';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [AutofocusDirective, EyeIconComponent, EyeOffIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements ControlValueAccessor {
  readonly label: InputSignal<string> = input<string>('');
  readonly type: InputSignal<InputType> = input<InputType>('text');
  readonly placeholder: InputSignal<string> = input<string>('');
  readonly required: InputSignal<boolean> = input<boolean>(false);
  readonly autocomplete: InputSignal<string> = input<string>('');
  readonly min: InputSignal<number | null> = input<number | null>(null);
  readonly ariaLabel: InputSignal<string> = input<string>('');
  readonly errors: InputSignal<Record<string, string>> = input<Record<string, string>>({});
  readonly autofocus: InputSignal<boolean> = input<boolean>(false);

  // Manual accessor assignment avoids the NG_VALUE_ACCESSOR forwardRef cycle
  // and lets the template read errors/touched straight from the control.
  private readonly ngControl: NgControl | null = inject(NgControl, {
    self: true,
    optional: true,
  });

  protected readonly inputId: string = `form-input-${Math.random().toString(36).slice(2, 9)}`;
  protected readonly value: WritableSignal<string> = signal<string>('');
  protected readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isPasswordVisible: WritableSignal<boolean> = signal<boolean>(false);

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: unknown): void {
    this.value.set(value === null || value === undefined ? '' : String(value));
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected readonly effectiveType: Signal<InputType> = computed<InputType>(() =>
    this.type() === 'password' && this.isPasswordVisible() ? 'text' : this.type()
  );

  protected get shouldShowError(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && control.touched);
  }

  protected get errorText(): string | null {
    if (!this.shouldShowError) return null;
    const controlErrors = this.ngControl?.control?.errors;
    if (!controlErrors) return null;

    if (typeof controlErrors['error'] === 'string') {
      return controlErrors['error'];
    }

    const messages = this.errors();
    const matchedKey = Object.keys(controlErrors).find((key) => messages[key]);
    return matchedKey ? messages[matchedKey] : null;
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value.set(raw);
    this.onChange(this.coerce(raw));
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected togglePassword(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  private coerce(raw: string): unknown {
    if (this.type() !== 'number') return raw;
    if (raw === '') return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
