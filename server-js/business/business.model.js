import {
    insertNewBusinessDB, renameBusinessDB,
    removeBusinessDB, migrateBusinessDB, getBusinessNamesDB
} from "./business.db.js"

export async function addBusiness(username, profileName, categoryName, businessName) {
    const business = {
        name: businessName,
        transactions: []
    }
    const businessAdded = await insertNewBusinessDB(username, profileName, categoryName, business);
    if (!businessAdded) {
        console.log("Failed to add business")
    }
    console.log("Business added successfully")
    return businessAdded;
}

export async function renameBusinessInCategory(username, profileName, categoryName, businessName, newName) {
    const businessRenamed = await renameBusinessDB(username, profileName, categoryName, businessName, newName);
    if (!businessRenamed) {
        console.log("Failed to rename business")
    }
    console.log("Business renamed successfully")
    return businessRenamed;
}

export async function migrateBusiness(username, profileName, currentCategoryName, nextCategoryName, businessName) {
    const businessMigrated = await migrateBusinessDB(username, profileName, currentCategoryName, nextCategoryName, businessName);
    if (!businessMigrated) {
        console.log("Failed to migrate business")
    }
    console.log("Business migrated successfully")
    return businessMigrated;
}

export async function removeBusinessFromCategory(username, profileName, categoryName, businessName) {
    const businessRemoved = await removeBusinessDB(username, profileName, categoryName, businessName);
    if (!businessRemoved) {
        console.log("Failed to remove business")
    }
    console.log("Business removed successfully")
    return businessRemoved;
}

export async function getBusinessNames(username, profileName, categoryName) {
    const businessDoc = await getBusinessNamesDB(username, profileName, categoryName);
    if (!businessDoc) {
        console.log("Failed to get business names")
        return businessDoc;
    }
    const businessNames = businessDoc.profile.expenses.categories[0].businesses.map(b => b.name);
    return businessNames;
}
