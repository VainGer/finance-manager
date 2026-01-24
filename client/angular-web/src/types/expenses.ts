export interface CategoriesAndBusinesses {
  category: string;
  businesses: string[];
}

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
}

export interface Business {
  name: string;
  bankNames?: string[];
  transactionsArray: TransactionsArray[];
}

export interface TransactionsArray {
  DateYM: string;
  transactions: Transaction[];
}

export interface Category {
  name: string;
  Businesses: Business[];
}
