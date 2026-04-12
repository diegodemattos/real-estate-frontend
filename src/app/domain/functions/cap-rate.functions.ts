export type CapRateCategory = 'good' | 'high' | 'low' | 'neutral';

export function computeCapRate(noi: number, purchasePrice: number): number {
  return purchasePrice > 0 ? noi / purchasePrice : 0;
}

export function classifyCapRate(rate: number): CapRateCategory {
  if (rate >= 0.05 && rate <= 0.12) return 'good';
  if (rate > 0.12) return 'high';
  if (rate > 0 && rate < 0.05) return 'low';
  return 'neutral';
}
