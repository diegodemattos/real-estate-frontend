import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value !== 'string') return null;
  return control.value.trim().length === 0 ? { whitespace: true } : null;
}
