import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
  pure: true,
})
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string, search: string): SafeHtml {
    if (!search?.trim()) {
      return text;
    }

    // Escape the original text to prevent XSS from deal name content
    const safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    // Escape regex special chars in the search term
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    const highlighted = safeText.replace(
      regex,
      '<mark class="highlight">$1</mark>'
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
