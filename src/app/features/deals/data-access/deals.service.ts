import { Injectable } from '@angular/core';
import { Observable, defer, delay, of, throwError } from 'rxjs';
import { Deal, NewDeal, UpdatedDeal } from '../models/deal.model';

const DEALS_KEY = 're_deals';
const SIMULATED_LATENCY_MS = 400;

const SEED_DEALS: Deal[] = [
  {
    id: '1',
    dealName: 'Sunset Apartments',
    purchasePrice: 2_500_000,
    address: '1234 Sunset Blvd, Los Angeles, CA',
    noi: 175_000,
    capRate: 175_000 / 2_500_000,
  },
  {
    id: '2',
    dealName: 'Downtown Office Tower',
    purchasePrice: 8_000_000,
    address: '500 Main St, New York, NY',
    noi: 640_000,
    capRate: 640_000 / 8_000_000,
  },
  {
    id: '3',
    dealName: 'Harbor Retail Center',
    purchasePrice: 3_200_000,
    address: '88 Harbor Dr, Miami, FL',
    noi: 256_000,
    capRate: 256_000 / 3_200_000,
  },
  {
    id: '4',
    dealName: 'Greenway Industrial Park',
    purchasePrice: 5_500_000,
    address: '200 Greenway Rd, Houston, TX',
    noi: 385_000,
    capRate: 385_000 / 5_500_000,
  },
  {
    id: '5',
    dealName: 'Lakeside Condos',
    purchasePrice: 1_800_000,
    address: '45 Lake Shore Dr, Chicago, IL',
    noi: 108_000,
    capRate: 108_000 / 1_800_000,
  },
  {
    id: '6',
    dealName: 'Midtown Plaza',
    purchasePrice: 4_200_000,
    address: '300 Peachtree St NE, Atlanta, GA',
    noi: 336_000,
    capRate: 336_000 / 4_200_000,
  },
  {
    id: '7',
    dealName: 'Riverfront Warehouse',
    purchasePrice: 6_800_000,
    address: '1 Pier Ave, Seattle, WA',
    noi: 476_000,
    capRate: 476_000 / 6_800_000,
  },
  {
    id: '8',
    dealName: 'Oak Park Medical Center',
    purchasePrice: 9_500_000,
    address: '200 Longwood Ave, Boston, MA',
    noi: 760_000,
    capRate: 760_000 / 9_500_000,
  },
  {
    id: '9',
    dealName: 'Desert Vista Townhomes',
    purchasePrice: 2_100_000,
    address: '750 E Camelback Rd, Phoenix, AZ',
    noi: 147_000,
    capRate: 147_000 / 2_100_000,
  },
  {
    id: '10',
    dealName: 'University Heights Flats',
    purchasePrice: 3_700_000,
    address: '400 W 6th St, Austin, TX',
    noi: 296_000,
    capRate: 296_000 / 3_700_000,
  },
];

/**
 * Simulates a REST API for deals, persisting to localStorage.
 * Each method mirrors a typical HTTP verb (GET / POST / PUT / DELETE) and
 * emits asynchronously with a small artificial latency so the UI exercises
 * the same loading paths it would against a real backend.
 *
 * Replace the body of each method with an HttpClient call when a real API
 * becomes available — consumers won't need to change.
 */
@Injectable({ providedIn: 'root' })
export class DealsService {
  /** GET /api/deals */
  getDeals(): Observable<Deal[]> {
    return defer(() => of(this.readFromStorage())).pipe(
      delay(SIMULATED_LATENCY_MS)
    );
  }

  /** POST /api/deals */
  createDeal(newDeal: NewDeal): Observable<Deal> {
    return defer(() => {
      const deals = this.readFromStorage();
      const deal: Deal = {
        ...newDeal,
        id: Date.now().toString(),
        capRate: this.computeCapRate(newDeal.noi, newDeal.purchasePrice),
      };
      this.writeToStorage([...deals, deal]);
      return of(deal);
    }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /** PUT /api/deals/:id */
  updateDeal(updatedDeal: UpdatedDeal): Observable<Deal> {
    return defer(() => {
      const deals = this.readFromStorage();
      const exists = deals.some((d) => d.id === updatedDeal.id);
      if (!exists) {
        return throwError(
          () => new Error(`Deal ${updatedDeal.id} not found`)
        );
      }
      const deal: Deal = {
        ...updatedDeal,
        capRate: this.computeCapRate(
          updatedDeal.noi,
          updatedDeal.purchasePrice
        ),
      };
      this.writeToStorage(
        deals.map((d) => (d.id === deal.id ? deal : d))
      );
      return of(deal);
    }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  /** DELETE /api/deals/:id */
  deleteDeal(id: string): Observable<void> {
    return defer(() => {
      const deals = this.readFromStorage();
      this.writeToStorage(deals.filter((d) => d.id !== id));
      return of(void 0);
    }).pipe(delay(SIMULATED_LATENCY_MS));
  }

  private computeCapRate(noi: number, purchasePrice: number): number {
    return purchasePrice > 0 ? noi / purchasePrice : 0;
  }

  /**
   * Reads the deals array from localStorage.
   *
   * - Key absent (null): storage was cleared or first ever load →
   *   seed with SEED_DEALS and immediately persist so the key exists.
   * - Key present (even as "[]"): honours whatever the user left behind,
   *   including an intentionally empty list.
   * - Malformed JSON: falls back to SEED_DEALS to avoid a broken state.
   */
  private readFromStorage(): Deal[] {
    const raw = localStorage.getItem(DEALS_KEY);

    if (raw === null) {
      this.writeToStorage(SEED_DEALS);
      return SEED_DEALS;
    }

    try {
      return JSON.parse(raw) as Deal[];
    } catch {
      this.writeToStorage(SEED_DEALS);
      return SEED_DEALS;
    }
  }

  private writeToStorage(deals: Deal[]): void {
    localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
  }
}
