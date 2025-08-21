import { get, put, post, del } from '../utils/api.js';

export default function useEditTransactions({ profile }) {
    const addTransaction = async (e) => {
        e.preventDefault();
        if (!selectedCategory || !selectedBusiness || !amount || !date) {
            setError('אנא מלא את כל השדות');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const transaction = {
            amount: Number(amount),
            date: new Date(date),
            description: description
        }

        try {
            const response = await post('expenses/transaction/create', {
                refId: profile.expenses,
                catName: selectedCategory,
                busName: selectedBusiness,
                transaction
            });

            if (response.ok || response.success) {
                setSuccess('העסקה נוספה בהצלחה!');

                // Clear form
                setSelectedCategory(null);
                setSelectedBusiness(null);
                setAmount('');
                setDate('');
                setDescription('');

                // Trigger refresh of the dashboard
                if (onTransactionAdded) {
                    onTransactionAdded();
                }

                // Auto close after success
                setTimeout(() => {
                    goBack();
                }, 1500);
            } else {
                setError(response.message || 'שגיאה בהוספת העסקה');
            }
        } catch (err) {
            console.error('Error adding transaction:', err);
            setError('שגיאה בחיבור למסד הנתונים');
        } finally {
            setIsSubmitting(false);
        }
    }