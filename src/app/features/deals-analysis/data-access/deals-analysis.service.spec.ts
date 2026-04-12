import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DealsAnalysisService } from './deals-analysis.service';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Deal } from '../../../domain/models/deal.model';

describe('DealsAnalysisService', () => {
  let service: DealsAnalysisService;
  let httpMock: HttpTestingController;

  const deal: Deal = {
    id: '1',
    dealName: 'Sunset',
    purchasePrice: 2_500_000,
    address: '123 Main St',
    noi: 175_000,
    capRate: 0.07,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DealsAnalysisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should GET /deals', () => {
    service.getDeals().subscribe((deals) => {
      expect(deals).toEqual([deal]);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/deals`);
    expect(req.request.method).toBe('GET');
    req.flush([deal]);
  });
});
