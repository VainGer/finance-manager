import { getDB } from '../db.js';

const db = await getDB();

export async function addCategoryDB(username, profileName, category) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne({
            "profile.profileName": profileName
        },
            { $addToSet: { "profile.expenses.categories": category } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
}

export async function deleteCategoryDB(username, profileName, category) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            { "profile.profileName": profileName },
            { $pull: { "profile.expenses.categories": { name: category } } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}

export async function deleteCategorySaveBusinessesDB(username, profileName, category, nextCat) {
    try {
        //todo
        return true;
    } catch (error) {
        console.error("Error deleting category and saving businesses:", error);
        throw error;
    }
}

export async function renameCategoryDB(username, profileName, category, newName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            { "profile.profileName": profileName, "profile.expenses.categories.name": category },
            { $set: { "profile.expenses.categories.$.name": newName } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error renaming category:", error);
        throw error;
    }
}

export async function setCategoryPrivacyDB(username, profileName, category, privacy) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const result = await accountCollection.updateOne(
            { "profile.profileName": profileName, "profile.expenses.categories.name": category },
            { $set: { "profile.expenses.categories.$.isPrivate": privacy } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error setting category privacy:", error);
        throw error;
    }
}

export async function getProfileCategoriesDB(username, profileName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const profile = await accountCollection.findOne({ "profile.profileName": profileName });
        return profile ? profile.profile.expenses.categories : [];
    } catch (error) {
        console.error("Error getting profile categories:", error);
        throw error;
    }
}

export async function getAccountCategoriesDB(username, profileName) {
    try {
        const accountCollection = db.collection(`${username}_profiles`);
        const accountCategories = await accountCollection.aggregate(
            [
                { $match: {} },
                { $unwind: "$profile.expenses.categories" },
                {
                    $match:
                    {
                        $or:
                            [
                                { "profile.profileName": profileName },
                                {
                                    $and:
                                        [
                                            { "profile.profileName": { $ne: profileName } },
                                            { "profile.expenses.categories.isPrivate": { $ne: true } }
                                        ]
                                }
                            ]
                    }
                },
                {
                    $project:
                    {
                        category: "$profile.expenses.categories.name",
                        fromProfile: "$profile.profileName"
                    }
                }
            ]
        ).toArray();
        return accountCategories;
    } catch (error) {
        console.error("Error getting account categories:", error);
        throw error;
    }
}