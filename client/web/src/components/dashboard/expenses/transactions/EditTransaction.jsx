import { useState } from 'react';
import useEditTransactions from '../../../../hooks/useEditTransactions';
import CenteredModal from '../../../common/CenteredModal'


function formatDateForInput(date) {
    if (!date) return '';
    if (date instanceof Date) {
        return date.toISOString().slice(0, 10);
    }
    if (typeof date === 'string') {
        try {
            return new Date(date).toISOString().slice(0, 10);
        } catch {
            return '';
        }
    }
    return '';
}

export default function EditTransaction({ transaction, onTransactionUpdated }) {
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        amount: transaction.amount,
        date: formatDateForInput(transaction.date),
        description: transaction.description || ''
    });

    const {
        loading,
        error,
        success,
        changeTransactionAmount,
        changeTransactionDate,
        changeTransactionDescription,
        resetState
    } = useEditTransactions();

    const open = () => {
        resetState();
        setIsEditing(true);
    };

    const cancel = () => {
        resetState();
        setIsEditing(false);
        setForm({
            amount: transaction.amount,
            date: formatDateForInput(transaction.date),
            description: transaction.description || ''
        });
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const save = async () => {
        const edits = [];

        if (Number(form.amount) !== Number(transaction.amount)) {
            edits.push(() => changeTransactionAmount(transaction, Number(form.amount), { silent: true }));
        }

        const originalDate = formatDateForInput(transaction.date);
        if (form.date && form.date !== originalDate) {
            edits.push(() => changeTransactionDate(transaction, form.date, { silent: true }));
        }

        if ((form.description || '') !== (transaction.description || '')) {
            edits.push(() => changeTransactionDescription(transaction, form.description, { silent: true }));
        }

        if (edits.length === 0) {
            setIsEditing(false);
            return;
        }

        for (const edit of edits) {
            const res = await edit();
            if (!res.ok) return;
        }

        resetState();
        onTransactionUpdated?.();
        setIsEditing(false);
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
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
            </button>
        );
    }


    if (isEditing) {
        return (
            <CenteredModal onClose={cancel}>
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto relative text-right">
                    <div className="flex items-center justify-between mb-6">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <p className="text-lg font-semibold">עריכת עסקה</p>
                    </div>

                    <div className="space-y-4">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">סכום</label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">תאריך</label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">תיאור</label>
                            <input
                                type="text"
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                placeholder="תיאור העסקה"
                            />
                        </div>
                    </div>

                    {/* Status Messages */}
                    {error && <div className="text-red-600 text-sm text-center mt-3">{error}</div>}
                    {success && <div className="text-green-600 text-sm text-center mt-3">{success}</div>}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={save}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-medium"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    שומר...
                                </div>
                            ) : (
                                'שמירה'
                            )}
                        </button>
                        <button
                            onClick={cancel}
                            disabled={loading}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium"
                        >
                            ביטול
                        </button>
                    </div>
                </div>
            </CenteredModal>
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

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}

            <div className="flex items-center gap-2 pt-3">
                <button
                    onClick={save}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {loading ? (
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
                    disabled={loading}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    ביטול
                </button>
            </div>
        </div>
    );
}
