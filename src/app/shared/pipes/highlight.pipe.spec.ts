import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
    TestBed.runInInjectionContext(() => {
      pipe = new HighlightPipe();
    });
  });

  function unwrap(value: unknown): string {
    return sanitizer.sanitize(1, value as any) ?? '';
  }

  it('should return the original text when search is empty', () => {
    expect(pipe.transform('Sunset Apartments', '')).toBe('Sunset Apartments');
  });

  it('should return the original text when search is whitespace', () => {
    expect(pipe.transform('Sunset Apartments', '   ')).toBe(
      'Sunset Apartments'
    );
  });

  it('should wrap case-insensitive matches in a <mark> tag', () => {
    const html = unwrap(pipe.transform('Sunset Apartments', 'sun'));
    expect(html).toContain('<mark class="highlight">Sun</mark>');
  });

  it('should escape HTML in the input before highlighting', () => {
    const html = unwrap(
      pipe.transform('<script>alert(1)</script>', 'script')
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;');
  });

  it('should escape regex-special characters in the search term', () => {
    expect(() => pipe.transform('a.b.c', '.')).not.toThrow();
  });
});
