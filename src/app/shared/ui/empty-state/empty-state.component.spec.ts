import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EmptyStateComponent] });
  });

  it('renders the message input as the displayed text', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Nothing here yet');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.empty-state__message').textContent
    ).toContain('Nothing here yet');
  });
});
