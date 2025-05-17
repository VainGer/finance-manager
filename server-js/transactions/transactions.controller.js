import {
    addTransaction,
    editTransPrice,
    editTransactionDate,
    deleteTransaction
} from './transactions.model.js';

export async function addTransactionC(req, res) {
    const { username, profileName, category, business, price, date, description } = req.body;
    try {
        const success = await addTransaction(username, profileName, category, business, price, date, description);
        if (success) {
            res.status(201).json({ message: 'Transaction added successfully', status: 201 });
        } else {
            res.status(400).json({ message: 'Failed to add transaction', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}

export async function editTransPriceC(req, res) {
    const { username, profileName, category, business, id, newPrice } = req.body;
    try {
        const success = await editTransPrice(username, profileName, category, business, id, newPrice);
        if (success) {
            res.status(200).json({ message: 'Transaction price updated successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to update transaction price', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}

export async function editTransactionDateC(req, res) {
    const { username, profileName, category, business, id, newDate } = req.body;
    try {
        const success = await editTransactionDate(username, profileName, category, business, id, newDate);
        if (success) {
            res.status(200).json({ message: 'Transaction date updated successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to update transaction date', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}

export async function deleteTransactionC(req, res) {
    const { username, profileName, category, business, id } = req.body;
    try {
        const success = await deleteTransaction(username, profileName, category, business, id);
        if (success) {
            res.status(200).json({ message: 'Transaction deleted successfully', status: 200 });
        } else {
            res.status(400).json({ message: 'Failed to delete transaction', status: 400 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error, status: 500 });
    }
}