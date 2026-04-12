export interface LoginBody {
  username: string;
  password: string;
}

export interface CreateDealBody {
  dealName: string;
  purchasePrice: number;
  address: string;
  noi: number;
}

export type UpdateDealBody = Partial<CreateDealBody>;
