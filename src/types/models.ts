export interface Invoice {
  id?: string;
  concept: string;
  full_amount: number;
  vat: number;
  date: string;
  type?: 'income' | 'expense' | 'cost';
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
