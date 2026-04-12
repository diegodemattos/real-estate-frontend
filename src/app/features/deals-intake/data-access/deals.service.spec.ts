import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DealsService } from './deals.service';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Deal } from '../models/deal.model';

describe('DealsService', () => {
  let service: DealsService;
  let httpMock: HttpTestingController;

  const deal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 1_000_000,
    address: 'A',
    noi: 80_000,
    capRate: 0.08,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DealsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GETs /deals', () => {
    service.getDeals().subscribe((deals) => {
      expect(deals).toEqual([deal]);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/deals`);
    expect(req.request.method).toBe('GET');
    req.flush([deal]);
  });

  it('GETs /deals/:id', () => {
    service.getDealById('1').subscribe((d) => {
      expect(d).toEqual(deal);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/deals/1`);
    expect(req.request.method).toBe('GET');
    req.flush(deal);
  });

  it('POSTs /deals', () => {
    const newDeal = { dealName: 'New', purchasePrice: 500_000, address: 'B', noi: 40_000 };
    service.createDeal(newDeal).subscribe((d) => {
      expect(d.dealName).toBe('New');
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/deals`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDeal);
    req.flush({ id: '2', ...newDeal, capRate: 0.08 });
  });

  it('PATCHes /deals/:id', () => {
    const updated = { id: '1', dealName: 'Renamed', purchasePrice: 1_000_000, address: 'A', noi: 80_000 };
    service.updateDeal(updated).subscribe((d) => {
      expect(d.dealName).toBe('Renamed');
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/deals/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ dealName: 'Renamed', purchasePrice: 1_000_000, address: 'A', noi: 80_000 });
    req.flush({ ...deal, dealName: 'Renamed' });
  });

  it('DELETEs /deals/:id', () => {
    service.deleteDeal('1').subscribe();

    const req = httpMock.expectOne(`${API_BASE_URL}/deals/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
