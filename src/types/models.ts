export interface Expense {
  id?: number;
  concept: string;
  amount: number;
  date: string;
  type?: 'income' | 'expense';
  invoice_image?: string;
  issuer_id?: number;
  category_id?: number;
}

export interface Issuer {
  id?: number;
  name: string;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
}
