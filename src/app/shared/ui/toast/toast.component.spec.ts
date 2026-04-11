import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NotificationService } from '../../services/notification.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ToastComponent] });
    service = TestBed.inject(NotificationService);
  });

  it('renders nothing when there is no notification', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  });

  it('renders the notification with the correct variant class', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();

    service.success('Deal saved');
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.toast');
    expect(el).not.toBeNull();
    expect(el.classList.contains('toast--success')).toBe(true);
    expect(el.textContent).toContain('Deal saved');
  });

  it('auto-dismisses after the configured delay', fakeAsync(() => {
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();

    service.success('hi');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast')).not.toBeNull();

    tick(3500);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  }));

  it('resets the auto-dismiss timer when a new notification arrives (switchMap)', fakeAsync(() => {
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();

    service.success('first');
    fixture.detectChanges();

    tick(2000);
    service.success('second');
    fixture.detectChanges();

    // 2000ms after the second toast, the first toast's original 3500ms
    // window has elapsed but the timer was switched — toast still visible.
    tick(2000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('second');

    // Finish the second toast's timer.
    tick(1500);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  }));

  it('manual dismiss clears the toast immediately', () => {
    const fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();

    service.error('boom');
    fixture.detectChanges();

    fixture.componentInstance['onDismiss']();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast')).toBeNull();
  });
});
