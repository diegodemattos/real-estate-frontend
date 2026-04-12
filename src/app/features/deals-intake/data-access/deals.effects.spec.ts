import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Subject, of, throwError } from 'rxjs';
import { DealsEffects } from './deals.effects';
import { DealsActions } from './deals.actions';
import { DealsService } from './deals.service';
import { Deal } from '../../../domain/models/deal.model';

describe('DealsEffects', () => {
  let actions$: Subject<Action>;
  let effects: DealsEffects;
  let service: {
    getDeals: jest.Mock;
    createDeal: jest.Mock;
    updateDeal: jest.Mock;
    deleteDeal: jest.Mock;
  };

  const deal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    service = {
      getDeals: jest.fn(),
      createDeal: jest.fn(),
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DealsEffects,
        provideMockActions(() => actions$),
        { provide: DealsService, useValue: service },
      ],
    });

    effects = TestBed.inject(DealsEffects);
  });

  describe('loadDeals$', () => {
    it('dispatches loadDealsSuccess on success', (done) => {
      service.getDeals.mockReturnValue(of([deal]));

      effects.loadDeals$.subscribe((action) => {
        expect(action).toEqual(DealsActions.loadDealsSuccess({ deals: [deal] }));
        done();
      });

      actions$.next(DealsActions.loadDeals());
    });

    it('dispatches loadDealsFailure on error', (done) => {
      service.getDeals.mockReturnValue(throwError(() => new Error('Network error')));

      effects.loadDeals$.subscribe((action) => {
        expect(action.type).toBe(DealsActions.loadDealsFailure.type);
        done();
      });

      actions$.next(DealsActions.loadDeals());
    });
  });

  describe('addDeal$', () => {
    it('dispatches addDealSuccess on success', (done) => {
      service.createDeal.mockReturnValue(of(deal));

      effects.addDeal$.subscribe((action) => {
        expect(action).toEqual(DealsActions.addDealSuccess({ deal }));
        done();
      });

      actions$.next(DealsActions.addDeal({ deal: { dealName: 'Sunset', purchasePrice: 1_000_000, address: 'A', noi: 80_000 } }));
    });

    it('dispatches addDealFailure on error', (done) => {
      service.createDeal.mockReturnValue(throwError(() => new Error('fail')));

      effects.addDeal$.subscribe((action) => {
        expect(action.type).toBe(DealsActions.addDealFailure.type);
        done();
      });

      actions$.next(DealsActions.addDeal({ deal: { dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
    });
  });

  describe('updateDeal$', () => {
    it('dispatches updateDealSuccess on success', (done) => {
      const updated = { ...deal, dealName: 'Renamed' };
      service.updateDeal.mockReturnValue(of(updated));

      effects.updateDeal$.subscribe((action) => {
        expect(action).toEqual(DealsActions.updateDealSuccess({ deal: updated }));
        done();
      });

      actions$.next(DealsActions.updateDeal({ deal: { id: '1', dealName: 'Renamed', purchasePrice: 1_000_000, address: 'A', noi: 80_000 } }));
    });

    it('dispatches updateDealFailure on error', (done) => {
      service.updateDeal.mockReturnValue(throwError(() => new Error('fail')));

      effects.updateDeal$.subscribe((action) => {
        expect(action.type).toBe(DealsActions.updateDealFailure.type);
        done();
      });

      actions$.next(DealsActions.updateDeal({ deal: { id: '1', dealName: 'X', purchasePrice: 1, address: 'A', noi: 0 } }));
    });
  });

  describe('deleteDeal$', () => {
    it('dispatches deleteDealSuccess on success', (done) => {
      service.deleteDeal.mockReturnValue(of(void 0));

      effects.deleteDeal$.subscribe((action) => {
        expect(action).toEqual(DealsActions.deleteDealSuccess({ id: '1' }));
        done();
      });

      actions$.next(DealsActions.deleteDeal({ id: '1' }));
    });

    it('dispatches deleteDealFailure on error', (done) => {
      service.deleteDeal.mockReturnValue(throwError(() => new Error('fail')));

      effects.deleteDeal$.subscribe((action) => {
        expect(action.type).toBe(DealsActions.deleteDealFailure.type);
        done();
      });

      actions$.next(DealsActions.deleteDeal({ id: '1' }));
    });
  });
});
