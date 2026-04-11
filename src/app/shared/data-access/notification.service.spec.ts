import { TestBed } from '@angular/core/testing';
import { Notification, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('starts with null and replays the current value to new subscribers', () => {
    const spy = jest.fn();
    service.notification$.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('emits a success notification with a generated id', () => {
    const received: (Notification | null)[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.success('Deal created');

    const last = received[received.length - 1];
    expect(last).not.toBeNull();
    expect(last?.message).toBe('Deal created');
    expect(last?.variant).toBe('success');
    expect(typeof last?.id).toBe('string');
    expect(last?.id.length).toBeGreaterThan(0);
  });

  it('emits an error notification', () => {
    const received: (Notification | null)[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.error('Failed to delete');

    expect(received[received.length - 1]?.variant).toBe('error');
    expect(received[received.length - 1]?.message).toBe('Failed to delete');
  });

  it('dismiss clears the current notification', () => {
    const received: (Notification | null)[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.success('hello');
    service.dismiss();

    expect(received[received.length - 1]).toBeNull();
  });

  it('emits a fresh id even when the same message is shown twice', () => {
    const received: (Notification | null)[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.success('Saved');
    const firstId = received[received.length - 1]?.id;
    service.success('Saved');
    const secondId = received[received.length - 1]?.id;

    expect(firstId).toBeDefined();
    expect(secondId).toBeDefined();
    expect(firstId).not.toEqual(secondId);
  });
});
