import { TestBed } from '@angular/core/testing';
import { EyeOffIconComponent } from './eye-off-icon.component';

describe('EyeOffIconComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EyeOffIconComponent] });
  });

  it('renders an svg element', () => {
    const fixture = TestBed.createComponent(EyeOffIconComponent);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});
