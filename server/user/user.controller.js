import {
    addCategory, removeCategory, addItemToCategory, addTransaction, renameCategory, removeItemAndTransactions,
    editTransPrice, deleteTransaction
} from "./user.model.js";

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

export async function removeItemAndTransactions(req, res) {
    let { username, category, item } = req.body;
    let removed = await removeItemAndTransactions(username, category, item);

    if (removed) {
        res.status(200).json({ message: "Item removed successfully" });
    } else {
        res.status(401).json({ message: "Item wasn't removed" });
    }
}

export async function renameItem(req, res) {
    let { username, category, item, newName } = req.body;
    let renamed = await renameItemInCategory(username, category, item, newName);

    if (renamed) {
        res.status(200).json({ message: "Item renamed successfully" });
    } else {
        res.status(400).json({ message: "Item wasn't renamed" });
    }
}


export async function addTransact(req, res) {
    let { username, category, item, id, newPrice } = req.body;
    let added = await editTransPrice(username, category, item, id, newPrice);
    if (added) {
        res.status(200).json(
            {
                message: "Transaction added successfully"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "Transaction wasn't added to category"
            }
        )
    };
}

export async function editTransPrice(req, res) {
    let { username, category, item, price, date } = req.body;
    let eddited = await addTransaction(username, category, item, price, date);
    if (eddited) {
        res.status(200).json(
            {
                message: "Transaction price was eddited, new price:" + newPrice
            }
        );
    } else {
        res.status(401).json(
            {
                message: "Transaction wasn't eddited"
            }
        )
    };
}

export async function deleteTrans(req, res) {
    let { username, category, item, id } = req.body;
    let deleted = await deleteTransaction(username, category, item, id);
    if (deleted) {
        res.status(200).json(
            {
                message: "Transaction was deleted"
            }
        );
    } else {
        res.status(401).json(
            {
                message: "Transaction wasn't deleted"
            }
        )
    };
}