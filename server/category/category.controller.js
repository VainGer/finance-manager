import {
    addCategory,
    removeCategory,
    removeCategorySaveBusinesses,
    renameCategory,
    setCategoryPrivacy,
    getProfileCategories,
    getAccountCategories,
    getCategoriesNames,
    getAccountCategoriesNames
} from './category.model.js';

export async function addCategoryC(req, res) {
    const { username, profileName, category, privacy } = req.body;
    try {
        const result = await addCategory(username, profileName, category, privacy);
        if (result) {
            res.status(201).json({
                message: "Category added successfully",
                status: 201
            });
        } else {
            res.status(400).json({
                message: "Category already exists or an error occurred",
                status: 400
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function removeCategoryC(req, res) {
    const { username, profileName, category } = req.body;
    try {
        const result = await removeCategory(username, profileName, category);
        if (result) {
            res.status(200).json({
                message: "Category removed successfully",
                status: 200
            });
        } else {
            res.status(404).json({
                message: "Category not found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function removeCategoryAndSaveBusinessesC(req, res) {
    const { username, profileName, category, nextCat } = req.body;
    try {
        const result = await removeCategorySaveBusinesses(username, profileName, category, nextCat);
        if (result) {
            res.status(200).json({
                message: "Category removed and businesses moved successfully",
                status: 200
            });
        } else {
            res.status(404).json({
                message: "Category not found or target category not found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function renameCategoryC(req, res) {
    const { username, profileName, category, newName } = req.body;
    try {
        const result = await renameCategory(username, profileName, category, newName);
        if (result) {
            res.status(200).json({
                message: "Category renamed successfully",
                status: 200
            });
        } else {
            res.status(404).json({
                message: "Category not found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function setCategoryPrivacyC(req, res) {
    const { username, profileName, category, privacy } = req.body;
    try {
        const result = await setCategoryPrivacy(username, profileName, category, privacy);
        if (result) {
            res.status(200).json({
                message: "Category privacy updated successfully",
                status: 200
            });
        } else {
            res.status(404).json({
                message: "Category not found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function getProfileCategoriesC(req, res) {
    const { username, profileName } = req.query;
    try {
        const categories = await getProfileCategories(username, profileName);
        if (categories) {
            res.status(200).json({
                message: "Categories retrieved successfully",
                categories,
                status: 200
            });
        } else {
            res.status(404).json({
                message: "No categories found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function getAccountCategoriesC(req, res) {
    const { username, profileName } = req.query;
    try {
        const categories = await getAccountCategories(username, profileName);
        if (categories) {
            res.status(200).json({
                message: "Account categories retrieved successfully",
                categories,
                status: 200
            });
        } else {
            res.status(404).json({
                message: "No categories found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function getCategoriesNamesC(req, res) {
    const { username, profileName } = req.query;
    try {
        const categoryNames = await getCategoriesNames(username, profileName);
        if (categoryNames) {
            res.status(200).json({
                message: "Category names retrieved successfully",
                categoryNames,
                status: 200
            });
        } else {
            res.status(404).json({
                message: "No categories found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}

export async function getAccountCategoriesNamesC(req, res) {
    const { username, profileName } = req.query;
    try {
        const categoryNames = await getAccountCategoriesNames(username, profileName);
        if (categoryNames) {
            res.status(200).json({
                message: "Account category names retrieved successfully",
                categoryNames,
                status: 200
            });
        } else {
            res.status(404).json({
                message: "No categories found",
                status: 404
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: 500
        });
    }
}
