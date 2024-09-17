export interface StockHistory {
  productId: number;
  sellerId: number;
  productName: string;
  changeAmount: number;
  changeType: ChangeType;
  reason: string;
  updatedAt: string; // ISO date string format
}

export type ChangeType = 'ADDITION' | 'REMOVAL' | 'ADJUSTMENT';
