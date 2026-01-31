import { Injectable } from '@angular/core';
import { Category, FlattenedExpenses } from '../types';
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  //flattening the raw data, creating easier iteration over dates, available dates set
  processExpenses(expenses: Category[]) {
    const flat: FlattenedExpenses[] = [];
    const monthlyMap: Record<string, FlattenedExpenses[]> = {};
    const dates: Set<string> = new Set<string>();
    expenses.forEach((category) =>
      category.Businesses?.forEach((business) =>
        business.transactionsArray.forEach(({ dateYM, transactions }) => {
          transactions?.forEach((transaction) => {
            const processed = {
              _id: transaction._id,
              amount: Number(transaction.amount),
              date: new Date(transaction.date),
              description: transaction.description,
              category: category.name,
              business: business.name,
              dateYM,
            };
            flat.push(processed);
            (monthlyMap[dateYM] ??= []).push(processed);
            dates.add(dateYM);
          });
        }),
      ),
    );
    return {
      flatExpenses: flat,
      monthlyExpenses: monthlyMap,
      availableDates: dates,
    };
  }
  
}
