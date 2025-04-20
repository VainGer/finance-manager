import {
    addBusiness,
    renameBusinessInCategory,
    migrateBusiness,
    removeBusinessFromCategory
} from './business.model.js';

export async function addBusinessC(req, res) {
    const { username, pName, categoryName, businessName } = req.body;
    try {
        const success = await addBusiness(username, pName, categoryName, businessName);
        if (success) {
            res.status(200).json({ message: 'Business added successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to add business', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}

export async function renameBusinessInCategoryC(req, res) {
    const { username, pName, categoryName, businessName, newName } = req.body;
    try {
        const success = await renameBusinessInCategory(username, pName, categoryName, businessName, newName);
        if (success) {
            res.status(200).json({ message: 'Business renamed successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to rename business', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}

export async function migrateBusinessC(req, res) {
    const { username, pName, currentCategoryName, nextCategoryName, businessName } = req.body;
    try {
        const success = await migrateBusiness(username, pName, currentCategoryName, nextCategoryName, businessName);
        if (success) {
            res.status(200).json({ message: 'Business migrated successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to migrate business', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}

export async function removeBusinessFromCategoryC(req, res) {
    const { username, pName, categoryName, businessName } = req.body;
    try {
        const success = await removeBusinessFromCategory(username, pName, categoryName, businessName);
        if (success) {
            res.status(200).json({ message: 'Business removed successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to remove business', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}