import { addTransactionDB, removeTransactionDB, editTransactionDateDB, editTransactionPriceDB } from "./transactions.db.js";

export async function addTransaction(username, profileName, category, business, price, date, description) {
    const transaction = {
        price: price,
        date: date,
        description: description,
        id: category + Date.now() + Math.floor(Math.random() * 1000)
    }
    const transactionAdded = await addTransactionDB(username, profileName, category, business, transaction);
    if (!transactionAdded) {
        console.log("Transaction not added");
    }
    console.log("Transaction added successfully");
    return transactionAdded;
}

export async function editTransPrice(username, profileName, category, business, id, newPrice) {
    const transactionEdited = await editTransactionPriceDB(username, profileName, category, business, id, newPrice);
    if (!transactionEdited) {
        console.log("Transaction price not edited");
    }
    console.log("Transaction price edited successfully");
    return transactionEdited;
}

export async function editTransactionDate(username, profileName, category, business, id, newDate) {
    const transactionEdited = await editTransactionDateDB(username, profileName, category, business, id, newDate);
    if (!transactionEdited) {
        console.log("Transaction date not edited");
    }
    console.log("Transaction date edited successfully");
    return transactionEdited;
}

export async function deleteTransaction(username, profileName, category, business, id) {
    const transactionDeleted = await removeTransactionDB(username, profileName, category, business, id);
    if (!transactionDeleted) {
        console.log("Transaction not deleted");
    }
    console.log("Transaction deleted successfully");
    return transactionDeleted;
}