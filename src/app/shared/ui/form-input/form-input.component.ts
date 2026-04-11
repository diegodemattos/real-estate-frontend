import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number';

@Component({
  selector: 'app-form-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly autocomplete = input<string>('');
  readonly min = input<number | null>(null);
  readonly ariaLabel = input<string>('');

  // Manual accessor assignment avoids the NG_VALUE_ACCESSOR forwardRef cycle
  // and lets the template read errors/touched straight from the control.
  private readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  protected readonly inputId = `form-input-${Math.random().toString(36).slice(2, 9)}`;
  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);
  protected readonly isPasswordVisible = signal<boolean>(false);

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

  protected get effectiveType(): InputType {
    return this.type() === 'password' && this.isPasswordVisible()
      ? 'text'
      : this.type();
  }

  protected get shouldShowError(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && control.touched);
  }

  protected get errorText(): string | null {
    if (!this.shouldShowError) return null;
    const errors = this.ngControl?.control?.errors;
    if (!errors) return null;

    const label = this.label() || 'This field';
    if (errors['required']) return `${label} is required.`;
    if (errors['email']) return 'Please enter a valid email.';
    if (errors['min']) {
      const min = (errors['min'] as { min?: number })?.min;
      return min !== undefined
        ? `${label} must be at least ${min}.`
        : `${label} is below the minimum.`;
    }
    return 'Invalid value.';
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
