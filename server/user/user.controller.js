import {
    addCategory, removeCategory, addItemToCategory,
    addTransaction, renameCategory, removeItemFromCategory, renameItemInCategory,
    editTransPrice, deleteTransaction,
    removeCategorySaveItems,
    migrateItem
} from "./user.model.js";

//in router
export async function addCat(req, res) {
    let { username, category } = req.body;
    let added = await addCategory(username, category);
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

//in router
export async function removeCat(req, res) {
    let { username, category } = req.body;
    let removed = await removeCategory(username, category);
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

//in router
export async function removeCatSaveItems(req, res) {
    let { username, category } = req.body;
    let removed = await removeCategorySaveItems(username, category);
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

//in router
export async function renameCat(req, res) {
    let { username, category, newName } = req.body;
    let renamed = await renameCategory(username, category, newName);
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

//in router
export async function addItemToCat(req, res) {
    let { username, category, item } = req.body;
    let added = await addItemToCategory(username, category, item);
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

//in router
export async function renameItem(req, res) {
    let { username, category, item, newName } = req.body;
    let renamed = await renameItemInCategory(username, category, item, newName);

    if (renamed) {
        res.status(200).json({ message: "Item renamed successfully" });
    } else {
        res.status(400).json({ message: "Item wasn't renamed" });
    }
}

//in router
export async function removeItem(req, res) {
    let { username, category, item } = req.body;
    let removed = await removeItemFromCategory(username, category, item);
    if (removed) {
        res.status(200).json({ message: "Item removed successfully" });
    } else {
        res.status(401).json({ message: "Item wasn't removed" });
    }
}

export async function moveItem(req, res) {
    let { username, currentCat, nextCat, itemName } = req.body;
    let moved = await migrateItem(username, currentCat, nextCat, itemName);
    if (moved) {
        res.status(200).json({ message: "Item moved successfully" });
    } else {
        res.status(401).json({ message: "Item wasn't moved" });
    }
}


//in router
export async function addTransact(req, res) {
    let { username, category, item, price, date } = req.body;
    let added = await addTransaction(username, category, item, price, date);
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

//in router
export async function editTransactionPrice(req, res) {
    let { username, category, item, id, newPrice } = req.body;
    let edited = await editTransPrice(username, category, item, id, newPrice);
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

//in router
export async function deleteTransact(req, res) {
    let { username, category, item, id } = req.body;
    let delted = await deleteTransaction(username, category, item, id);
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