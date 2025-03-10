import { useState, useEffect, useCallback } from 'react';

export default function EditTransactionPriceAndDate({ username, profileName, category, item, id, currentPrice, currentDate,
    onTransactionUpdate, onSubmitEdit, closeEditor }) {

    const [newPrice, setNewPrice] = useState();
    const [newDate, setNewDate] = useState("");

    const editTransactionPrice = useCallback(async () => {
        try {
            let response = await fetch('http://localhost:5500/api/profile/edit_price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, category, item, id, newPrice })
            });
            let data = await response.json();
            console.log("Response from edit_price:", data);
            if (response.ok) {
                onTransactionUpdate();
            }
        } catch (error) {
            console.error(error);
        }
    }, [username, profileName, category, item, id, newPrice, onTransactionUpdate]);

    const updateDate = useCallback(async () => {
        try {
            let response = await fetch('http://localhost:5500/api/profile/edit_date', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, profileName, category, item, id, newDate })
            });
            let data = await response.json();
            console.log("Response from edit_date:", data);
            if (response.ok) {
                onTransactionUpdate();
                closeEditor();
            }
        } catch (error) {
            console.error(error);
        }
    }, [username, profileName, category, item, id, newDate, onTransactionUpdate]);

    const updateTransaction = useCallback(async () => {
        await editTransactionPrice();
        await updateDate();
    }, [editTransactionPrice, updateDate]);

    useEffect(() => {
        if (onSubmitEdit) {
            onSubmitEdit(() => updateTransaction);
        }
    }, [onSubmitEdit, updateTransaction]);

    useEffect(() => {
        setNewDate(currentDate);
    }, [currentDate])

    useEffect(() => {
        setNewPrice(currentPrice);
    }, [currentPrice])

    return (
        <form className="grid *:my-2 text-center *:text-center" name='price-form '>
            <labe className='font-bold'>הזן סכום חדש</labe>
            <input
                className='border-1'
                type="number"
                defaultValue={newPrice}
                placeholder='הזן סכום חדש'
                onChange={(e) => setNewPrice(e.target.value)}
            />
            <label className='font-bold'>בחר תאריך חדש</label>
            <input
                className='text-center w-full border-1'
                type="date"
                defaultValue={newDate}
                onChange={(e) => setNewDate(e.target.value)}
            />
        </form>
    );
}