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
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg p-2 transition-colors group"
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
                    className="group-hover:scale-110 transition-transform"
                >
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                </svg>
            </button>
        );
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="font-medium">עריכת עסקה</span>
            </div>
            
            <div className="md:grid md:grid-cols-3 md:gap-4 sm:grid sm:grid-cols-1 sm:gap-4">
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">סכום</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={onChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="סכום"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">תאריך</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                
                <div className="space-y-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-slate-700">תיאור</label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="תיאור העסקה"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 pt-3">
                <button 
                    onClick={save} 
                    disabled={saving} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {saving ? (
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            שומר...
                        </div>
                    ) : (
                        'שמירה'
                    )}
                </button>
                <button 
                    onClick={cancel} 
                    disabled={saving} 
                    className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    ביטול
                </button>
            </div>
        </div>
    );
}
