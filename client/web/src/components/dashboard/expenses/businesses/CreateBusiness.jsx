import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';
import CategorySelect from '../categories/CategorySelect';

export default function CreateBusiness({ goBack }) {

    const { profile } = useAuth();
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);

    const createBusiness = async (e) => {
        e.preventDefault();

        const response = await post('expenses/add-business', {
            refId: profile.expenses,
            name,
            catName: category
        });
        if (response.ok) {
            goBack();
        } else if (response.status === 409) {
            setError('שם בעל העסק כבר קיים');
        } else {
            setError('אירעה שגיאה בעת יצירת בעל העסק, נסה שוב מאוחר יותר');
            console.error('Error creating business:', response.error);
        }
    }

    return (
        <form onSubmit={createBusiness}>
            {error && (
                <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">
                    {error}
                </p>
            )}
            <CategorySelect refId={profile.expenses} setSelectedCategory={setCategory} />
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="הכנס שם בעל עסק" />
            <input type="submit" value="הוסף בעל עסק" />
            <input type="button" value="ביטול" onClick={goBack} />
        </form>
    );
}