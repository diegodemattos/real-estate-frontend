import { computeCapRate, classifyCapRate } from './cap-rate.functions';

describe('computeCapRate', () => {
  it('should return noi / purchasePrice', () => {
    expect(computeCapRate(80_000, 1_000_000)).toBeCloseTo(0.08);
  });

  it('should return 0 when purchasePrice is 0', () => {
    expect(computeCapRate(80_000, 0)).toBe(0);
  });

  it('should return 0 when purchasePrice is negative', () => {
    expect(computeCapRate(80_000, -1)).toBe(0);
  });
});

describe('classifyCapRate', () => {
  it('should return good for rates between 5% and 12%', () => {
    expect(classifyCapRate(0.05)).toBe('good');
    expect(classifyCapRate(0.08)).toBe('good');
    expect(classifyCapRate(0.12)).toBe('good');
  });

  it('should return high for rates above 12%', () => {
    expect(classifyCapRate(0.15)).toBe('high');
  });

  it('should return low for rates between 0 (exclusive) and 5%', () => {
    expect(classifyCapRate(0.03)).toBe('low');
  });

  it('should return neutral for 0 or negative rates', () => {
    expect(classifyCapRate(0)).toBe('neutral');
    expect(classifyCapRate(-0.01)).toBe('neutral');
  });
});
