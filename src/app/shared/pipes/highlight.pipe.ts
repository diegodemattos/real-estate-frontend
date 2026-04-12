import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
  pure: true,
})
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(text: string, search: string): SafeHtml {
    if (!search?.trim()) {
      return text;
    }

    const safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    const highlighted = safeText.replace(
      regex,
      '<mark class="highlight">$1</mark>'
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
