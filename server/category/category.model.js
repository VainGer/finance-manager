import {
    addCategoryDB, deleteCategoryDB, deleteCategorySaveBusinessesDB, renameCategoryDB
    , setCategoryPrivacyDB, getProfileCategoriesDB, getAccountCategoriesDB
} from "./category.db"

export async function addCategory(username, profileName, category, privacy) {
    const category = {
        name: category,
        budgets: [],
        businesses: [],
        isPrivate: privacy
    }
    const result = await addCategoryDB(username, profileName, category);
    if (!result) {
        console.log("Category already exists")
        return false;
    }
    return result;
}

export async function removeCategory(username, profileName, category) {
    const result = await deleteCategoryDB(username, profileName, category);
    if (!result) {
        console.log("Category not found")
        return false;
    }
    return result;
}

export async function removeCategorySaveBusinesses(username, profileName, category, nextCat) {
    return true;
}

export async function renameCategory(username, profileName, category, newName) {
    const result = await renameCategoryDB(username, profileName, category, newName);
    if (!result) {
        console.log("Category not found")
        return false;
    }
    return result;
}

export async function setCategoryPrivacy(username, profileName, category, privacy) {
    const result = await setCategoryPrivacyDB(username, profileName, category, privacy);
    if (!result) {
        console.log("Category not found")
        return false;
    }
    return result;
}

export async function getProfileCategories(username, profileName) {
    const categories = await getProfileCategoriesDB(username, profileName);
    if (!categories || categories.length === 0) {
        console.log("Categories not found")
        return false;
    }
    return categories;
}

export async function getAccountCategories(username, profileName) {
    const categories = await getAccountCategoriesDB(username, profileName);
    if (!categories || categories.length === 0) {
        console.log("Categories not found")
        return false;
    }
    return categories;
}

export async function getCategoriesNames(username, profileName) {
    const categories = await getProfileCategoriesDB(username, profileName);
    if (!categories || categories.length === 0) {
        console.log("Categories not found")
        return false;
    }
    return categories.map(category => category.name);
}

export async function getAccountCategoriesNames(username, profileName) {
    const categories = await getAccountCategoriesDB(username, profileName);
    if (!categories || categories.length === 0) {
        console.log("Categories not found")
        return false;
    }
    return categories.map(category => category.name);
}