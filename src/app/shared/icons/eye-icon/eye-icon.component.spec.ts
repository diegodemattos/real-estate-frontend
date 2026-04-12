import { TestBed } from '@angular/core/testing';
import { EyeIconComponent } from './eye-icon.component';

describe('EyeIconComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EyeIconComponent] });
  });

  it('renders an svg element', () => {
    const fixture = TestBed.createComponent(EyeIconComponent);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });
});
