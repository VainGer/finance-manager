import { ObjectId } from "mongodb";
import { Transaction } from "./expenses.types";
import { ProfileBudget } from "../profile/profile.types";
import db from "../../server";
import { profile } from "console";



export default class TransactionModel {
    private static expenseCollection: string = "expenses";

    static async createTransaction(refId: ObjectId, catName: string, busName: string, transaction: Transaction) {
        try {
            const amount = Number(transaction.amount);
            const newTransaction: Transaction = {
                _id: new ObjectId(),
                amount,
                date: transaction.date,
                description: transaction.description
            };

            const updatedBudgets = await this.updateBudgets(refId, catName, 0, amount, transaction.date);
            if (!updatedBudgets) {
                return { status: 500, error: "Failed to update budgets" };
            }
            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $push: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": newTransaction } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName }
                    ]
                });

            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, or business not found" };
            } else {
                return {
                    status: 201,
                    message: "Transaction created successfully",
                    transactionId: newTransaction._id
                };
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async changeTransactionAmount(refId: ObjectId, catName: string, busName: string, transactionId: ObjectId, newAmount: number) {
        try {
            const updatedBudgets = await this.updateBudgetsOnTransactionChange
                (refId, catName, busName, newAmount, transactionId);
            if (updatedBudgets.status !== 200) {
                return { status: updatedBudgets.status, error: updatedBudgets.error };
            }
            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $set: { "categories.$[catFilter].Businesses.$[bizFilter].transactions.$[transFilter].amount": newAmount } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName },
                        { "transFilter._id": transactionId }
                    ]
                });

            if (!result || result.matchedCount === 0 || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, business, or transaction not found" };
            } else {
                return {
                    status: 200,
                    message: "Transaction amount changed successfully",
                };
            }
        } catch (error) {
            console.error("Error changing transaction amount:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async getTransactionsByBusiness(refId: ObjectId, catName: string, busName: string) {
        try {
            const expensesDoc = await db.GetDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { projection: { "categories": 1 } }
            );

            if (!expensesDoc || !expensesDoc.categories) {
                return { status: 404, error: "Expense document not found" };
            }

            const category = expensesDoc.categories.find((cat: any) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }

            const business = category.Businesses?.find((bus: any) => bus.name === busName);
            if (!business) {
                return { status: 404, error: "Business not found" };
            }

            return {
                status: 200,
                transactions: business.transactions || []
            };
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async deleteTransaction(refId: ObjectId, catName: string, busName: string, transactionId: ObjectId) {
        try {
            const updatedBudgets = await this.updateBudgetsOnTransactionChange(refId, catName, busName, 0, transactionId);
            if (updatedBudgets.status !== 200) {
                return { status: updatedBudgets.status, error: updatedBudgets.error };
            }

            const result = await db.UpdateDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { $pull: { "categories.$[catFilter].Businesses.$[bizFilter].transactions": { _id: transactionId } } },
                {
                    arrayFilters: [
                        { "catFilter.name": catName },
                        { "bizFilter.name": busName }
                    ]
                });

            if (!result || result.modifiedCount === 0) {
                return { status: 404, error: "Expense, category, business, or transaction not found" };
            } else {
                return {
                    status: 200,
                    message: "Transaction deleted successfully"
                };
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    static async getTransactionById(refId: ObjectId, catName: string, busName: string, transactionId: ObjectId) {
        try {
            const expensesDoc = await db.GetDocument(
                TransactionModel.expenseCollection,
                { _id: refId },
                { projection: { "categories": 1 } }
            );

            if (!expensesDoc || !expensesDoc.categories) {
                return { status: 404, error: "Expense document not found" };
            }

            // Find the relevant category
            const category = expensesDoc.categories.find((cat: any) => cat.name === catName);
            if (!category) {
                return { status: 404, error: "Category not found" };
            }

            // Find the relevant business
            const business = category.Businesses?.find((bus: any) => bus.name === busName);
            if (!business) {
                return { status: 404, error: "Business not found" };
            }

            // Find the specific transaction
            const transaction = business.transactions?.find(
                (trans: Transaction) => trans._id.toString() === transactionId.toString()
            );

            if (!transaction) {
                return { status: 404, error: "Transaction not found" };
            }

            return {
                status: 200,
                transaction
            };
        } catch (error) {
            console.error("Error fetching transaction:", error);
            return { status: 500, error: "Internal server error" };
        }
    }

    // Updates both profile and category budgets based on transaction changes
    private static async updateBudgets(refId: ObjectId, catName: string, oldAmount: number, newAmount: number, tDate: Date) {
        try {

            const expenseDoc = await db.GetDocument(TransactionModel.expenseCollection, { _id: refId });
            if (!expenseDoc) return false;
            
            // 2. Extract username and profileName to find the correct profile
            const { username, profileName } = expenseDoc;
            if (!username || !profileName) {
                console.error("Expense document is missing username or profileName");
                return false;
            }
            
            // 3. Find the profile using the extracted info
            const profile = await db.GetDocument("profiles", { username, profileName });
            if (!profile) {
                console.error(`Profile not found for username: ${username}, profileName: ${profileName}`);
                return false;
            }
            
            // 4. Find the matching budget for this transaction date
            const transactionDate = new Date(tDate);
            const profileBudget = profile.budgets.find((budget: ProfileBudget) =>
                new Date(budget.startDate) <= transactionDate && new Date(budget.endDate) >= transactionDate);
            
            // 5. If no budget covers this period, it's not an error
            if (!profileBudget) return true;
            
            // 6. Calculate the difference to apply to budgets
            const dif = newAmount - oldAmount;
            
            // 7. Update the profile budget
            const updatedProfileBudget = await db.UpdateDocument("profiles", 
                { username, profileName, "budgets._id": profileBudget._id }, 
                { $inc: { "budgets.$.spent": dif } }
            );
            
            // 8. Update the matching category budget
            const updatedCategoryBudget = await db.UpdateDocument("expenses", 
                { _id: refId },
                { $inc: { "categories.$[cat].budgets.$[budget].spent": dif } },
                { 
                    arrayFilters: [
                        { "cat.name": catName },
                        { "budget._id": profileBudget._id }
                    ]
                }
            );
            
            // 9. Check that both updates were acknowledged
            return !!(updatedProfileBudget?.acknowledged && updatedCategoryBudget?.acknowledged);
        } catch (error) {
            console.error("Error updating budgets on transaction:", error, {
                refId: refId.toString(),
                catName,
                date: tDate,
                oldAmount,
                newAmount
            });
            return false;
        }
    }

    /**
     * Helper method to update budgets when a transaction is changed or deleted
     * First retrieves the transaction to get its current amount and date
     * Then calls updateBudgets to perform the actual budget updates
     */
    private static async updateBudgetsOnTransactionChange
        (refId: ObjectId, catName: string, busName: string, newAmount: number, transactionId: ObjectId) {
        // 1. Get the transaction to access its current amount and date
        const transaction = await this.getTransactionById(refId, catName, busName, transactionId);
        if (transaction.status !== 200) {
            return { status: transaction.status, error: transaction.error };
        } else {
            // 2. Call updateBudgets with the old and new amount values
            const updatedBudgets = await this.updateBudgets
                (refId, catName, transaction.transaction.amount, newAmount, transaction.transaction.date);
            if (!updatedBudgets) {
                return { status: 500, error: "Failed to update budgets" };
            }
            return { status: 200, message: "Budgets updated successfully" };
        }
    }
}