import { readFile, writeFile } from "fs/promises";

//in use
export async function addCategory(username, profileName, category, privacy = false) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        category = { categoryName: category, private: privacy, items: [] };
        let categories = profile.expenses.categories;
        if (categories.find(cat => cat.categoryName === category.categoryName)) {
            console.log("category name exists")
            return false;
        }
        categories.push(category);
        profile.expenses.categories = categories;
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        console.log("Category added");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function removeCategory(username, profileName, category) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let initLength = profile.expenses.categories.length;
        profile.expenses.categories = profile.expenses.categories.filter(cat => cat.categoryName !== category);
        if (initLength > profile.expenses.categories.length) {
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}


//in use
export async function removeCategorySaveItems(username, profileName, category, nextCat) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let currentCat = profile.expenses.categories.find(cat => cat.categoryName === category);
        if (currentCat) {
            let nextCategory = profile.expenses.categories.find(c => c.categoryName === nextCat);
            currentCat.items.forEach(item => nextCategory.items.push(item));
            profile.expenses.categories = profile.expenses.categories.filter(cat => cat.categoryName !== category);
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function renameCategory(username, profileName, category, newName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(cat => cat.categoryName === category)
        if (cat) {
            cat.categoryName = newName;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function addItemToCategory(username, profileName, category, item) {
    try {
        let jItem = { iName: item, transactions: [] }
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
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

//in use
export async function setCategoryPrivacy(username, profileName, category, privacy) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
        cat.private = privacy;
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//TODO
export async function renameItemInCategory(username, profileName, category, item, newName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
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

//TODO
export async function migrateItem(username, profileName, currentCat, nextCat, itemName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let currentCategory = profile.expenses.categories.find(c => c.categoryName === currentCat);
        let nextCategory = profile.expenses.categories.find(c => c.categoryName === nextCat)
        let item = currentCategory.items.find(i => i.iName === itemName);
        nextCategory.items.push(item);
        currentCategory.items = currentCategory.items.filter(i => i.iName !== itemName);
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}


//TODO
export async function removeItemFromCategory(username, profileName, category, item) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
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

//in use
export async function addTransaction(username, profileName, category, item, price, date) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let id = data.globalID++;
        let transaction = { id, price, date };
        itemData.transactions.push(transaction);
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export async function editTransPrice(username, profileName, category, item, id, newPrice) {
    try {
        newPrice = Number(newPrice);
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let transaction = itemData.transactions.find(d => d.id == id);
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

export async function editTransactionDate(username, profileName, category, item, id, newDate) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let transaction = itemData.transactions.find(d => d.id == id);
        if (transaction) {
            transaction.date = newDate;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function deleteTransaction(username, profileName, category, item, id) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
        if (!cat) {
            console.log("No such category");
            return false;
        }
        let itemData = cat.items.find(i => i.iName === item);
        if (!itemData) {
            console.log("No such item")
            return false;
        }
        let initLength = itemData.transactions.length;
        itemData.transactions = itemData.transactions.filter(t => t.id != id);
        if (initLength > itemData.transactions.length) {
            data.globalID--;
            await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function getProfileCategories(username, profileName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        return profile.expenses.categories;
    } catch (error) {
        console.log(error);
        return [];
    }
}

//in use
export async function getProfileExpenses(username, profileName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        profile.expenses.categories.forEach(c => {
            c.items.forEach(i => {
                i.transactions.forEach(t => t.related = "פרופיל שלי");
            });
        });
        return profile.expenses.categories;
    } catch (error) {
        console.log(error);
        return [];
    }
}

//in use
export async function getAllExpenses(username, profileName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let expenses = await getProfileExpenses(username, profileName);
        let profile = data.profiles.find(p => p.pName === profileName);
        if (!profile.parent) {
            return expenses;
        }
        let profiles = data.profiles.filter(p => p.pName !== profileName);
        profiles.forEach(p => {
            let categories = p.expenses.categories;
            categories.forEach(c => {
                c.items.forEach(i => {
                    i.transactions.forEach(t => t.related = p.pName);
                })
                if (!c.private) {
                    expenses.forEach(e => {
                        e.items.forEach(i => {
                            let item = c.items.find(it => it.iName === i.iName);
                            if (item) {
                                i.transactions.push(...item.transactions);
                                c.items = c.items.filter(it => it.iName !== i.iName);
                            }
                        }
                        );
                    }
                    );
                    expenses.push(c);
                }
            });
        });
        return expenses;
    } catch (error) {
        console.log(error);
        return [];
    }
}

//in use
export async function getCategoryItems(username, profileName, categoryName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        if (!profile) {
            console.log("No such profile");
            return [];
        }
        let category = profile.expenses.categories.find(c => c.categoryName === categoryName);
        if (!category) {
            console.log("No such category");
            return [];
        }
        return category.items.map(item => item.iName);
    } catch (error) {
        console.log(error);
        return [];
    }
}