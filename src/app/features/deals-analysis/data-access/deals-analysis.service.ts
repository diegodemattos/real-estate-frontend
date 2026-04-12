import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Deal } from '../../../domain/models/deal.model';

@Injectable({ providedIn: 'root' })
export class DealsAnalysisService {
  private readonly http: HttpClient = inject(HttpClient);

  getDeals(): Observable<Deal[]> {
    return this.http.get<Deal[]>(`${API_BASE_URL}/deals`);
  }
}
