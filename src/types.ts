export interface MetalPrices {
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
  rhodium: number;
  chartData?: { date: string, price: number }[];
  updatedAt: string;
}

export interface StoneType {
  name: string;
  density: number;
}

export interface StoneShape {
  name: string;
  multiplier: number;
}

export interface MemoItem {
  id: string;
  description: string;
  weight: number;
  cost: number;
  sellPrice: number;
  commission: number;
  onMemoTo: string;
  dateAdded: string;
  dueDate: string;
  status: 'active' | 'returned' | 'sold';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
