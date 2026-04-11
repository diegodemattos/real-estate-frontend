import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Deal, NewDeal, UpdatedDeal } from '../models/deal.model';

@Injectable({ providedIn: 'root' })
export class DealsService {
  private readonly http = inject(HttpClient);

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${API_BASE_URL}/deals`);
  }

  getDealById(id: string): Observable<Deal> {
    return this.http.get<Deal>(`${API_BASE_URL}/deals/${id}`);
  }

  createDeal(newDeal: NewDeal): Observable<Deal> {
    return this.http.post<Deal>(`${API_BASE_URL}/deals`, newDeal);
  }

  updateDeal(updatedDeal: UpdatedDeal): Observable<Deal> {
    const { id, ...body } = updatedDeal;
    return this.http.patch<Deal>(`${API_BASE_URL}/deals/${id}`, body);
  }

  deleteDeal(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/deals/${id}`);
  }
}
