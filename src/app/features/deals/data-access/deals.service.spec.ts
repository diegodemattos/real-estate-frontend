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

  const sampleDeal: Deal = {
    id: '1',
    dealName: 'Sunset Apartments',
    purchasePrice: 2_500_000,
    address: '1234 Sunset Blvd',
    noi: 175_000,
    capRate: 0.07,
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
      expect(deals).toEqual([sampleDeal]);
    });
    const req = httpMock.expectOne(`${API_BASE_URL}/deals`);
    expect(req.request.method).toBe('GET');
    req.flush([sampleDeal]);
  });

  it('GETs /deals/:id', () => {
    service.getDealById('1').subscribe((deal) => {
      expect(deal).toEqual(sampleDeal);
    });
    const req = httpMock.expectOne(`${API_BASE_URL}/deals/1`);
    expect(req.request.method).toBe('GET');
    req.flush(sampleDeal);
  });

  it('POSTs /deals with the new deal body', () => {
    const newDeal = {
      dealName: 'New Deal',
      purchasePrice: 1_000_000,
      address: '1 Main St',
      noi: 80_000,
    };
    service.createDeal(newDeal).subscribe();
    const req = httpMock.expectOne(`${API_BASE_URL}/deals`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDeal);
    req.flush({ ...newDeal, id: '99', capRate: 0.08 });
  });

  it('PATCHes /deals/:id with the body minus the id', () => {
    service
      .updateDeal({
        id: '1',
        dealName: 'Updated',
        purchasePrice: 2_000_000,
        address: '2 Main St',
        noi: 160_000,
      })
      .subscribe();
    const req = httpMock.expectOne(`${API_BASE_URL}/deals/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      dealName: 'Updated',
      purchasePrice: 2_000_000,
      address: '2 Main St',
      noi: 160_000,
    });
    req.flush(sampleDeal);
  });

  it('DELETEs /deals/:id', () => {
    service.deleteDeal('1').subscribe();
    const req = httpMock.expectOne(`${API_BASE_URL}/deals/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
