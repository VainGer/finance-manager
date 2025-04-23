import { getDB } from '../db.js';

const db = getDB();


export async function addTransactionDB(username, profileName, category, business, transaction) {
    try {
        const profileCollection = db.collection(`${username}_profiles`);
        const result = await profileCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": category,
                "profile.expenses.categories.businesses.name": business
            },
            {
                $addToSet:
                {
                    "profile.expenses.categories.$[cat].businesses.$[bus].transactions": transaction
                }
            });
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Error adding transaction:', error);
        return false;
    }
}

export async function editTransactionPriceDB(username, profileName, category, business, id, newPrice) {
    try {
        const profileCollection = db.collection(`${username}_profiles`);
        const result = await profileCollection.updateOne(
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
        const profileCollection = db.collection(`${username}_profiles`);
        const result = await profileCollection.updateOne(
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
        const profileCollection = db.collection(`${username}_profiles`);
        const result = await profileCollection.updateOne(
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