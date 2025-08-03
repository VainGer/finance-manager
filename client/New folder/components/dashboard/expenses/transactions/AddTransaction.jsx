import { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import CategorySelect from "../categories/CategorySelect";
import BusinessSelect from "../businesses/BusinessSelect";
import { post } from "../../../../utils/api";

export default function AddTransaction({ goBack }) {
    const { profile } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [amount, setAmount] = useState(null);
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const addTransaction = async (e) => {
        e.preventDefault();
        console.log('Adding transaction:', {
            selectedCategory,
            selectedBusiness,
            amount,
            date,
            description
        });
        if (!selectedCategory || !selectedBusiness || !amount || !date) {
            setError('אנא מלא את כל השדות');
            return;
        }
        const transaction = {
            amount: amount,
            date: new Date(date),
            description: description
        }

        const response = await post('expenses/create-transaction', {
            refId: profile.expenses,
            catName: selectedCategory,
            busName: selectedBusiness,
            transaction
        });

        console.log(response);

    }

    return (
        <form onSubmit={addTransaction}>

            <CategorySelect refId={profile.expenses} setSelectedCategory={setSelectedCategory} />
            {selectedCategory && <BusinessSelect refId={profile.expenses} category={selectedCategory} setSelectedBusiness={setSelectedBusiness} />}
            {selectedBusiness && (
                <>
                    <input type="number" name="amount" id="amount" placeholder="סכום" onChange={(e) => setAmount(e.target.value)} />
                    <label htmlFor="date">בחר תאריך</label>
                    <input type="date" name="date" id="date" onChange={(e) => setDate(e.target.value)} />
                    <input type="text" name="description" id="description" placeholder="תיאור" onChange={(e) => setDescription(e.target.value)} />
                    <input type="submit" value="הוסף הוצאה" />
                </>
            )}
            <input type="button" value="חזור" onClick={goBack} />
        </form>
    );
}