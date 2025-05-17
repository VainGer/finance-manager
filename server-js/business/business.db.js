import { getDB } from '../db.js';

const db = await getDB();

export async function insertNewBusinessDB(username, profileName, categoryName, business) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": categoryName
            },
            {
                $addToSet: { "profile.expenses.categories.$.businesses": business }
            }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error inserting new business:", error);
        throw error;
    }
}

export async function renameBusinessDB(username, profileName, categoryName, businessName, newBusinessName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            { "profile.profileName": profileName },
            {
                $set: { "profile.expenses.categories.$[cat].businesses.$[bus].name": newBusinessName }
            },
            {
                arrayFilters: [
                    { "cat.name": categoryName },
                    { "bus.name": businessName }
                ]
            }
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error renaming business:", error);
        throw error;
    }
}

export async function removeBusinessDB(username, profileName, categoryName, businessName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            {
                "profile.profileName": profileName,
                "profile.expenses.categories.name": categoryName
            },
            {
                $pull: { "profile.expenses.categories.$.businesses": { name: businessName } }
            }
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error removing business:", error);
        throw error;
    }
}

export async function migrateBusinessDB(username, profileName, currentCategory, nextCategory, businessName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const currentCategoryDB = await accountCollection.findOne(
            { "profile.profileName": profileName, "profile.expenses.categories.name": currentCategory },
        );
        const businessToMigrate = currentCategoryDB.profile.expenses.categories[0].businesses.find(b => b.name === businessName);
        if (!businessToMigrate) {
            console.log("Business not found in current category");
            return false;
        }
        const removingOldResult = await removeBusinessDB(username, profileName, currentCategory, businessName);
        const migratingResult = await accountCollection.updateOne(
            { "profile.profileName": profileName, "profile.expenses.categories.name": nextCategory },
            {
                $push: { "profile.expenses.categories.$.businesses": businessToMigrate }
            }
        );
        return migratingResult.modifiedCount > 0 && removingOldResult;
    } catch (error) {
        console.error("Error migrating business:", error);
        throw error;
    }
}

export async function getBusinessNamesDB(username, profileName, categoryName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.findOne(
            { "profile.profileName": profileName, "profile.expenses.categories.name": categoryName }
        );
        return result;
    } catch (error) {
        console.error("Error getting business names:", error);
        throw error;
    }
}
