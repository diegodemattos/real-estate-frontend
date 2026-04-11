import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number';

/**
 * Reusable labelled form input that implements `ControlValueAccessor` so it
 * plugs into reactive forms via `formControlName` / `formControl`.
 *
 * Features:
 *   - label with optional required marker
 *   - `text`, `email`, `password`, `number` types
 *   - built-in show/hide toggle on password type
 *   - error rendering driven by the underlying NgControl's validity
 *     (generates sensible defaults for `required`, `email`, `min`)
 *   - visual theming via CSS custom properties (`--form-input-*`) so
 *     ancestor scopes can restyle without touching this file — the auth
 *     layout uses this to switch from the app purple to a flat blue.
 *
 * NgControl is injected with `{ self: true }` and the accessor is assigned
 * manually in the constructor — this sidesteps the forwardRef cycle that
 * `NG_VALUE_ACCESSOR` would otherwise introduce and lets the component
 * read the control's error/touched state directly from the template.
 */
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

  /**
   * Accessible name for screen readers when no visible `label` is shown.
   * Use this for inputs that are grouped under a shared heading (e.g. the
   * Min/Max pair in a price range filter).
   */
  readonly ariaLabel = input<string>('');

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

  // ── ControlValueAccessor ────────────────────────────────────────────

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

  // ── Template API ────────────────────────────────────────────────────

  protected get effectiveType(): InputType {
    if (this.type() === 'password' && this.isPasswordVisible()) {
      return 'text';
    }
    return this.type();
  }

  protected get shouldShowError(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && control.touched);
  }

  protected get errorText(): string | null {
    if (!this.shouldShowError) {
      return null;
    }
    const errors = this.ngControl?.control?.errors;
    if (!errors) {
      return null;
    }

    const labelText = this.label() || 'This field';

    if (errors['required']) {
      return `${labelText} is required.`;
    }
    if (errors['email']) {
      return 'Please enter a valid email.';
    }
    if (errors['min']) {
      const minValue = (errors['min'] as { min?: number })?.min;
      return minValue !== undefined
        ? `${labelText} must be at least ${minValue}.`
        : `${labelText} is below the minimum.`;
    }

    return 'Invalid value.';
  }

  // ── Event handlers ──────────────────────────────────────────────────

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value.set(raw);
    this.onChange(this.coerceValue(raw));
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected togglePassword(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  private coerceValue(raw: string): unknown {
    if (this.type() === 'number') {
      if (raw === '') {
        return null;
      }
      const parsed = Number(raw);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return raw;
  }
}
