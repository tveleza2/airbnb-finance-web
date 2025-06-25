export interface Expense {
  id?: string;
  concept: string;
  amount: number;
  date: string;
  type?: 'income' | 'expense';
  invoice_image?: string;
  issuer_id?: string;
  category_id?: string;
}

export interface Issuer {
  id?: string;
  name: string;
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
}
