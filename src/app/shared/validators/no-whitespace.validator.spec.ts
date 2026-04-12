import { FormControl } from '@angular/forms';
import { noWhitespaceValidator } from './no-whitespace.validator';

describe('noWhitespaceValidator', () => {
  it('returns null for non-empty trimmed string', () => {
    expect(noWhitespaceValidator(new FormControl('hello'))).toBeNull();
  });

  it('returns null for string with leading/trailing spaces but content', () => {
    expect(noWhitespaceValidator(new FormControl('  hello  '))).toBeNull();
  });

  it('returns { whitespace: true } for whitespace-only string', () => {
    expect(noWhitespaceValidator(new FormControl('   '))).toEqual({ whitespace: true });
  });

  it('returns { whitespace: true } for empty string', () => {
    expect(noWhitespaceValidator(new FormControl(''))).toEqual({ whitespace: true });
  });

  it('returns null for non-string values', () => {
    expect(noWhitespaceValidator(new FormControl(null))).toBeNull();
    expect(noWhitespaceValidator(new FormControl(42))).toBeNull();
  });
});
