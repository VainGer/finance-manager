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
  dateYM: string;
  transactions: Transaction[];
}

export interface Category {
  name: string;
  Businesses: Business[];
}

export interface FlattenedExpenses {
  amount: number;
  business: string;
  category: string;
  dateYM: string;
  date: Date;
  description: string;
  _id: string;
}
