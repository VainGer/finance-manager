import { getDB } from '../db.js';

const db = await getDB();


export async function addTransactionDB(username, profileName, category, business, transaction) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        console.log(`Adding transaction:
        Username: ${username}
        Profile Name: ${profileName}
        Category: ${category}
        Business: ${business}
        Transaction: ${JSON.stringify(transaction, null, 2)}`);
        const result = await accountCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": category,
                "profile.expenses.categories.businesses.name": business
            },
            {
                $push: {
                    "profile.expenses.categories.$[cat].businesses.$[bus].transactions": transaction
                }
            },
            {
                arrayFilters: [
                    { "cat.name": category },
                    { "bus.name": business }
                ]
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error adding transaction:', error);
        return false;
    }
}

export async function editTransactionPriceDB(username, profileName, category, business, id, newPrice) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": category,
                "profile.expenses.categories.businesses.name": business,
                "profile.expenses.categories.businesses.transactions.id": id
            },
            {
                $set: {
                    "profile.expenses.categories.$[cat].businesses.$[bus].transactions.$[tr].price": newPrice
                }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error editing transaction price:', error);
        return false;
    }
}

export async function editTransactionDateDB(username, profileName, category, business, id, newDate) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": category,
                "profile.expenses.categories.businesses.name": business,
                "profile.expenses.categories.businesses.transactions.id": id
            },
            {
                $set: {
                    "profile.expenses.categories.$[cat].businesses.$[bus].transactions.$[tr].date": newDate
                }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error editing transaction date:', error);
        return false;
    }
}

export async function removeTransactionDB(username, profileName, category, business, id) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": category,
                "profile.expenses.categories.businesses.name": business
            },
            {
                $pull: {
                    "profile.expenses.categories.$[cat].businesses.$[bus].transactions": { id: id }
                }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error removing transaction:', error);
        return false;
    }
}