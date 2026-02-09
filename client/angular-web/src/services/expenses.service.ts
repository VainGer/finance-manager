import { Injectable } from '@angular/core';
import {
  Category,
  ExpenseSummary,
  FlattenedExpenses,
  ItemSummary,
} from '../types';
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


  filterByDate(
    monthlyExpenses: Record<string, FlattenedExpenses[]>,
    selectedDate: string,
  ) {
    return [...monthlyExpenses[selectedDate]];
  }

  filterByCategory(expenses: FlattenedExpenses[], selectedCategory: string) {
    return expenses.filter((e) => e.category === selectedCategory);
  }

  filterByBusiness(expenses: FlattenedExpenses[], selectedBusiness: string) {
    return expenses.filter((e) => e.business === selectedBusiness);
  }

  sortByDate(descending: boolean, expenses: FlattenedExpenses[]) {
    const result = [...expenses];
    if (descending) {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else {
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }
    return result;
  }

  sortByAmount(descending: boolean, expenses: FlattenedExpenses[]) {
    const result = [...expenses];
    if (descending) {
      result.sort((a, b) => b.amount - a.amount);
    } else {
      result.sort((a, b) => a.amount - b.amount);
    }
    return result;
  }

  makeSummary(expenses: FlattenedExpenses[], byCategory: boolean) {
    const transactionNumber = expenses.length;
    const transactionsSum = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const avgTransaction = (transactionsSum / transactionNumber).toFixed(1);
    const itemSummary: Record<string, ItemSummary> = {};
    const key: 'category' | 'business' = byCategory ? 'category' : 'business';
    expenses.forEach((e) => {
      const keyValue = e[key];
      if (!itemSummary[keyValue]) {
        itemSummary[keyValue] = {
          totalSum: 0,
          percentOfTotal: 0,
        };
      }
      itemSummary[keyValue].totalSum += e.amount;
    });
    Object.entries(itemSummary).forEach(([name, summary]) => {
      summary.percentOfTotal = Number(
        ((summary.totalSum / transactionsSum) * 100).toFixed(1),
      );
    });
    const sortedEntries = Object.entries(itemSummary).sort(
      ([, a], [, b]) => b.totalSum - a.totalSum,
    );

    const sortedItemSummary: Record<string, ItemSummary> = {};
    sortedEntries.forEach(([key, value]) => {
      sortedItemSummary[key] = value;
    });
    const expensesSummary: ExpenseSummary = {
      transactionsNumber: transactionNumber,
      transactionsSum: transactionsSum,
      transactionAvg: Number(avgTransaction),
      numberOfItems: Object.keys(itemSummary).length,
      itemSummary: sortedItemSummary,
    };
    return expensesSummary;
  }
}
