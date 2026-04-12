export interface Deal {
  id: string;
  dealName: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number;
}

export interface DealFilters {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export type NewDeal = Omit<Deal, 'id' | 'capRate'>;

export interface DealFormValue {
  dealName: string | null;
  purchasePrice: number | null;
  address: string | null;
  noi: number | null;
}

/** Payload for updating an existing deal. capRate is recomputed in the store. */
export type UpdatedDeal = Omit<Deal, 'capRate'>;
