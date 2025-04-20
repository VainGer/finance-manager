



export async function addTransaction(username, profileName, category, business, price, date) {
    try {
        const data = await getUserData(username);
        const profile = data.profiles.find(p => p.pName === profileName);
        const cat = findCategory(profile, category);
        const businessData = findBusiness(cat, business);
        const id = data.globalID++;
        const transaction = { id, price, date };
        businessData.transactions.push(transaction);
        await saveUserData(username, data);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

export async function editTransPrice(username, profileName, category, business, id, newPrice) {
    try {
        const data = await getUserData(username);
        const profile = data.profiles.find(p => p.pName === profileName);
        if (!profile) throw new Error("Profile not found");

        const cat = findCategory(profile, category);
        if (!cat) throw new Error("No such category");

        const businessData = findBusiness(cat, business);
        if (!businessData) throw new Error("No such business");

        const transaction = businessData.transactions.find(t => t.id == id);
        if (!transaction) throw new Error("Transaction not found");

        transaction.price = Number(newPrice);
        await saveUserData(username, data);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

export async function editTransactionDate(username, profileName, category, business, id, newDate) {
    try {
        const data = await getUserData(username);
        const profile = data.profiles.find(p => p.pName === profileName);
        const cat = findCategory(profile, category);
        const businessData = findBusiness(cat, business);
        const transaction = businessData.transactions.find(t => t.id == id);
        transaction.date = newDate;
        await saveUserData(username, data);
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

export async function deleteTransaction(username, profileName, category, business, id) {
    try {
        const data = await getUserData(username);
        const profile = data.profiles.find(p => p.pName === profileName);
        const cat = findCategory(profile, category);
        const businessData = findBusiness(cat, business);
        const initialLength = businessData.transactions.length;
        businessData.transactions = businessData.transactions.filter(t => t.id != id);
        if (businessData.transactions.length < initialLength) {
            data.globalID--;
            await saveUserData(username, data);
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}