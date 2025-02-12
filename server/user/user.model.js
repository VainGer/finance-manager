import { readFile, writeFile } from "fs/promises";

export async function addCategory(username, category) {
    try {
        category = { catName: category, items: [] };
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let categories = data.categories;
        if (categories.find(cat => cat.catName === category.catName)) {
            return false;
        }
        categories.push(category);
        data.categories = categories;
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        console.log("Category added");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function removeCategory(username, category) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let initLength = data.categories.length;
        data.categories = data.categories.filter(cat => cat.catName !== category);
        if (initLength > data.categories.length) {
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function renameCategory(username, category, newName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(cat => cat.catName === category)
        if (cat) {
            cat.catName = newName;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function addItemToCategory(username, category, item) {
    try {
        let jItem = { iName: item, transactions: [] }
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(c => c.catName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        if (cat.items.find(i => i.iName === item)) {
            console.log("item exist")
            return false;
        }
        cat.items.push(jItem);
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export async function renameItemInCategory(username, category, item, newName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(c => c.catName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let it = cat.items.find(i => i.iName === item);
        if (it) {
            it.iName = newName;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export async function removeItemFromCategory(username, category, item) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(c => c.catName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let initLength = cat.items.length;
        cat.items = cat.items.filter(i => i.iName !== item);
        if (initLength > cat.items.length) {
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function addTransaction(username, category, item, price, date) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(c => c.catName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let id = itemData.transactions.length + 1;
        let transaction = { id, price, date };
        itemData.transactions.push(transaction);
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function editTransPrice(username, category, item, id, newPrice) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(c => c.catName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let transaction = itemData.transactions.find(d => d.id === id);
        if (transaction) {
            transaction.price = newPrice;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function deleteTransaction(username, category, item, id) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let cat = data.categories.find(c => c.catName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let initLength = itemsData.transactions.length;
        itemData.transactions = itemData.transactions.filter(d => d.id !== id);
        if (initLength > itemData.transactions.length) {
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}