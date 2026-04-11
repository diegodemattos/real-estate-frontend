import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Deal, NewDeal, UpdatedDeal } from '../models/deal.model';

/**
 * Thin HttpClient wrapper for the Swagger-defined deals endpoints.
 * All mocking happens inside mock.interceptor.ts — this file stays pristine
 * when swapping to a real backend.
 */
@Injectable({ providedIn: 'root' })
export class DealsService {
  private readonly http = inject(HttpClient);

  /** GET /deals */
  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${API_BASE_URL}/deals`);
  }

  /** GET /deals/:id */
  getDealById(id: string): Observable<Deal> {
    return this.http.get<Deal>(`${API_BASE_URL}/deals/${id}`);
  }

  /** POST /deals */
  createDeal(newDeal: NewDeal): Observable<Deal> {
    return this.http.post<Deal>(`${API_BASE_URL}/deals`, newDeal);
  }

  /** PATCH /deals/:id */
  updateDeal(updatedDeal: UpdatedDeal): Observable<Deal> {
    const { id, ...body } = updatedDeal;
    return this.http.patch<Deal>(`${API_BASE_URL}/deals/${id}`, body);
  }

  /** DELETE /deals/:id */
  deleteDeal(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/deals/${id}`);
  }
}
