import {
    addCategory, removeCategory, addItemToCategory,
    addTransaction, renameCategory, removeItemFromCategory, renameItemInCategory,
    editTransPrice, deleteTransaction, removeCategorySaveItems, migrateItem,
    setCategoryPrivacy, getProfileExpenses, getAllExpenses, getProfileCategories, getCategoryItems
} from "./profile.model.js";

//in use
export async function addCat(req, res) {
    let { username, profileName, category, privacy } = req.body;
    let added = await addCategory(username, profileName, category, privacy);
    if (added) {
        res.status(200).json(
            {
                message: "category added"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "category wasn't added"
            }
        );
    }
}

//in use
export async function removeCat(req, res) {
    let { username, profileName, category } = req.body;
    let removed = await removeCategory(username, profileName, category);
    if (removed) {
        res.status(200).json(
            {
                message: "category removed"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "category wasn't removed"
            }
        );
    }
}

//in use
export async function removeCatSaveItems(req, res) {
    let { username, profileName, category, newCategory } = req.body;
    let removed = await removeCategorySaveItems(username, profileName, category, newCategory);
    if (removed) {
        res.status(200).json(
            {
                message: "category removed"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "category wasn't removed"
            }
        );
    }
}

//in use
export async function renameCat(req, res) {
    let { username, profileName, category, newName } = req.body;
    let renamed = await renameCategory(username, profileName, category, newName);
    if (renamed) {
        res.status(200).json(
            {
                message: "category renamed"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "category wasn't renamed"
            }
        );
    }
}

//in use
export async function setPrivacy(req, res) {
    let { username, profileName, category, privacy } = req.body;
    let privacySet = await setCategoryPrivacy(username, profileName, category, privacy);
    if (privacySet) {
        res.status(200).json({
            message: `${category} private :${privacy}`
        });
    } else {
        res.status(401).json({
            message: `${category} privacy change failed`
        });
    }
}

//in use
export async function addItemToCat(req, res) {
    let { username, profileName, category, item } = req.body;
    let added = await addItemToCategory(username, profileName, category, item);
    if (added) {
        res.status(200).json(
            {
                message: "item added to category"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "item wasn't added to category"
            }
        )
    };
}

//TODO
export async function renameItem(req, res) {
    let { username, profileName, category, item, newName } = req.body;
    let renamed = await renameItemInCategory(username, profileName, category, item, newName);

    if (renamed) {
        res.status(200).json({ message: "Item renamed successfully" });
    } else {
        res.status(400).json({ message: "Item wasn't renamed" });
    }
}

//TODO
export async function removeItem(req, res) {
    let { username, profileName, category, item } = req.body;
    let removed = await removeItemFromCategory(username, profileName, category, item);
    if (removed) {
        res.status(200).json({ message: "Item removed successfully" });
    } else {
        res.status(401).json({ message: "Item wasn't removed" });
    }
}

//TODO
export async function moveItem(req, res) {
    let { username, profileName, currentCat, nextCat, itemName } = req.body;
    let moved = await migrateItem(username, profileName, currentCat, nextCat, itemName);
    if (moved) {
        res.status(200).json({ message: "Item moved successfully" });
    } else {
        res.status(401).json({ message: "Item wasn't moved" });
    }
}


//in use
export async function addTransact(req, res) {
    let { username, profileName, category, item, price, date } = req.body;
    let added = await addTransaction(username, profileName, category, item, price, date);
    if (added) {
        res.status(200).json(
            {
                message: "spend added to item"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "spend wasn't added to category"
            }
        )
    }
}

//TODO
export async function editTransactionPrice(req, res) {
    let { username, profileName, category, item, id, newPrice } = req.body;
    let edited = await editTransPrice(username, profileName, category, item, id, newPrice);
    if (edited) {
        res.status(200).json({
            message: "transaction price was edited"
        });
    } else {
        res.status(401).json({
            message: "transaction price edit failed"
        });
    }
}

//in use
export async function deleteTransact(req, res) {
    let { username, profileName, category, item, id } = req.body;
    let delted = await deleteTransaction(username, profileName, category, item, id);
    if (delted) {
        res.status(200).json({
            message: "transaction deleted successfully"
        });
    } else {
        res.status(401).json({
            message: "transaction deletion failed"
        });
    }
}

//in use
export async function getCats(req, res) {
    let { username, profileName } = req.body;
    let cats = await getProfileCategories(username, profileName);
    if (cats.length > 0) {
        res.status(200).json({
            message: "Your categories",
            categories: cats
        });

    } else {
        res.status(401).json({
            message: "Categories not found"
        });
    }
}

//in use
export async function getProfExpenses(req, res) {
    let { username, profileName } = req.body;
    let expenses = await getProfileExpenses(username, profileName);
    if (expenses === "Error, could not get profile expenses") {
        res.status(401).json({
            message: expenses
        });
    }
    else {
        res.status(200).json({
            message: "Your profile expenses ready",
            expenses: expenses
        });
    }
}

//in use
export async function getAccautExpenses(req, res) {
    let { username, profileName } = req.body;
    let expenses = await getAllExpenses(username, profileName);
    if (expenses === "Error, could not get profile expenses") {
        res.status(401).json({
            message: "Expenses not found"
        });
    }
    else {
        res.status(200).json({
            message: "Your accaunt expenses",
            expenses: expenses
        });
    }
}

//in use
export async function getItems(req, res) {
    const { username, profileName, categoryName } = req.body;
    try {
        const items = await getCategoryItems(username, profileName, categoryName);
        res.status(200).json({ items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch items' });
    }
}
