import { useState } from 'react';
import { put } from '../../../../utils/api';

export default function EditTransaction({ transaction, refId, onTransactionUpdated }) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        amount: transaction.amount,
        date: transaction.date?.slice(0, 10),
        description: transaction.description || ''
    });

    const open = () => setIsEditing(true);
    const cancel = () => {
        setIsEditing(false);
        setForm({
            amount: transaction.amount,
            date: transaction.date?.slice(0, 10),
            description: transaction.description || ''
        });
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const save = async () => {
        const changes = [];
        const payloadBase = { refId, catName: transaction.category, busName: transaction.business, transactionId: transaction._id };

        if (Number(form.amount) !== Number(transaction.amount)) {
            changes.push(() => put('expenses/transaction/change-amount', { ...payloadBase, newAmount: Number(form.amount) }));
        }
        if (form.date && form.date !== transaction.date?.slice(0, 10)) {
            changes.push(() => put('expenses/transaction/change-date', { ...payloadBase, newDate: new Date(form.date) }));
        }
        if ((form.description || '') !== (transaction.description || '')) {
            changes.push(() => put('expenses/transaction/change-description', { ...payloadBase, newDescription: form.description }));
        }

        if (changes.length === 0) {
            setIsEditing(false);
            return;
        }

        setSaving(true);
        try {
            for (const call of changes) {
                const res = await call();
                if (!res.ok) {
                    throw new Error(res.message || 'עדכון נכשל');
                }
            }
            onTransactionUpdated?.();
            alert('העסקה עודכנה בהצלחה');
            setIsEditing(false);
        } catch (e) {
            console.error(e);
            alert(e.message || 'שגיאה בעדכון עסקה');
        } finally {
            setSaving(false);
        }
    };

    if (!isEditing) {
        return (
            <button
                onClick={open}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded p-1 transition-colors"
                title="עריכת עסקה"
                aria-label="עריכת עסקה"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={onChange}
                className="w-24 px-2 py-1 border rounded text-sm"
                placeholder="סכום"
            />
            <input
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                className="px-2 py-1 border rounded text-sm"
            />
            <input
                type="text"
                name="description"
                value={form.description}
                onChange={onChange}
                className="w-40 px-2 py-1 border rounded text-sm"
                placeholder="תיאור"
            />
            <div className="flex items-center gap-1">
                <button onClick={save} disabled={saving} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:bg-blue-300">שמירה</button>
                <button onClick={cancel} disabled={saving} className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 disabled:bg-gray-300">ביטול</button>
            </div>
        </div>
    );
}
