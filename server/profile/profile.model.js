import { readFile, writeFile } from "fs/promises";

//in use
export async function addCategory(username, profileName, category, privacy = false) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        category = { categoryName: category, private: privacy, budget: [], items: [] };
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

//in use
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

//in use
export async function migrateItem(username, profileName, currentCat, nextCat, itemName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let currentCategory = profile.expenses.categories.find(c => c.categoryName === currentCat);
        let nextCategory = profile.expenses.categories.find(c => c.categoryName === nextCat)
        let item = currentCategory.items.find(i => i.iName === itemName);
        console.log(console.log(item));
        nextCategory.items.push(item);
        currentCategory.items = currentCategory.items.filter(i => i.iName !== itemName);
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}


//in use
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

//in use
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

//in use
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
export async function getCategoriesList(username, profileName, forAccount) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        if (forAccount) {
            return await getAllExpenses(username, profileName);
        }
        return await getProfileExpenses(username, profileName);
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
                i.transactions.forEach(t => t.related = true);
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
        expenses.forEach(category => {
            category.profileName = profileName;
        });
        let profile = data.profiles.find(p => p.pName === profileName);
        if (!profile.parent) {
            return expenses;
        }
        let profiles = data.profiles.filter(p => p.pName !== profileName);
        profiles.forEach(p => {
            let categories = p.expenses.categories;
            categories.forEach(c => {
                c.profileName = p.pName;
                c.items.forEach(i => {
                    i.transactions.forEach(t => { t.related ? true : false });
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

//in use
export async function setProfileBudget(username, profileName, amount, startDate, endDate) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        if (!profile) {
            return false;
        }
        // Replace any existing budget with the new one
        profile.expenses.budget = [{
            profileName,
            amount,
            startDate,
            endDate
        }];
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function setCategoryBudget(username, profileName, category, amount, startDate, endDate) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let cat = profile.expenses.categories.find(c => c.categoryName === category);
        if (!cat) {
            return false;
        }
        // Replace any existing budget with the new one
        cat.budget = [{ amount, startDate, endDate }];
        await writeFile(`./data/users/${username}.json`, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//in use
export async function getProfileBudget(username, profileName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        if (!profile) {
            return [];
        }
        // Add profileName to each budget object if it doesn't exist
        return profile.expenses.budget.map(budget => ({
            ...budget,
            profileName: budget.profileName || profile.pName
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

//in use
export async function getCategoryBudget(username, profileName) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let budgets = [];
        profile.expenses.categories.forEach(c => {
            c.budget.forEach(b => {
                budgets.push({ category: c.categoryName, amount: b.amount, startDate: b.startDate, endDate: b.endDate });
            });
        });
        return budgets;
    } catch (error) {
        console.log(error);
        return [];
    }
}

//in use
export async function getAllCategoriesBetweenDates(username, profileName, startDate, endDate, forAccount) {
    try {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let filteredCategories = [];
        let categories = forAccount ? await getAllExpenses(username, profileName) : await getProfileExpenses(username, profileName);
        categories.forEach(category => {
            let filteredItems = [];
            category.items.forEach(item => {
                let filteredTransactions = item.transactions.filter(transaction => {
                    let transactionDate = new Date(transaction.date);
                    return transactionDate >= startDate && transactionDate <= endDate;
                });
                filteredItems.push({
                    iName: item.iName,
                    transactions: filteredTransactions
                });
            });
            filteredCategories.push({
                categoryName: category.categoryName,
                items: filteredItems
            });
        });
        return filteredCategories;
    } catch (error) {
        console.error("Error fetching filtered categories:", error.message);
        return [];
    }
}

//in use
export async function getCategory(username, profileName, category, forAccount) {
    try {
        let data = await readFile(`./data/users/${username}.json`, 'utf-8');
        data = JSON.parse(data);
        let profile = data.profiles.find(p => p.pName === profileName);
        let expenses = forAccount ? await getAllExpenses(username, profileName)
            : await getProfileExpenses(username, profileName);
        expenses = expenses.filter(c => c.categoryName === category);
        return expenses;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getCategoryBetweenDates(username, profileName, category, startDate, endDate) {
    try {
        let categoriesByDate = await getAllCategoriesBetweenDates(username, profileName, startDate, endDate);
        let filteredCategories = categoriesByDate.filter(cat => cat.categoryName === category);
        return filteredCategories;
    } catch (error) {
        console.error(error);
        return [];
    }
}
