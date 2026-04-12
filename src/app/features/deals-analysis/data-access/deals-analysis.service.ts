import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { AnalysisDeal } from '../models/deals-analysis.model';

@Injectable({ providedIn: 'root' })
export class DealsAnalysisService {
  private readonly http: HttpClient = inject(HttpClient);

  getDeals(): Observable<AnalysisDeal[]> {
    return this.http.get<AnalysisDeal[]>(`${API_BASE_URL}/deals`);
  }
}
