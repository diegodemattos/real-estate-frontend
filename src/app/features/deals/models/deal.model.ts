export interface Deal {
  id: string;
  dealName: string;
  purchasePrice: number;
  address: string;
  noi: number;
  capRate: number;
}

export interface DealFilters {
  name: string;
  priceMin: number | null;
  priceMax: number | null;
}

export type NewDeal = Omit<Deal, 'id' | 'capRate'>;

/** Payload for updating an existing deal. capRate is recomputed in the store. */
export type UpdatedDeal = Omit<Deal, 'capRate'>;
