import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { post } from '../../../../utils/api';
import CategorySelect from '../categories/CategorySelect';
import Button from '../../../common/Button';

export default function CreateBusiness({ goBack, onBusinessAdded }) {

    const { profile } = useAuth();
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);

    const createBusiness = async (e) => {
        e.preventDefault();

        const response = await post('expenses/business/add', {
            refId: profile.expenses,
            catName: category,
            name
        });
        if (response.ok) {
            if (onBusinessAdded) { onBusinessAdded(); }
            goBack();
        } else if (response.status === 409) {
            setError('שם בעל העסק כבר קיים');
        } else {
            setError('אירעה שגיאה בעת יצירת בעל העסק, נסה שוב מאוחר יותר');
            console.error('Error creating business:', response.error);
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">הוספת בעל עסק חדש</h3>
            
            <form onSubmit={createBusiness} className="space-y-4">
                {error && (
                    <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">
                        {error}
                    </p>
                )}
                
                <CategorySelect refId={profile.expenses} setSelectedCategory={setCategory} />
                
                <input 
                    type="text" 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="הכנס שם בעל עסק" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                <div className="flex gap-3">
                    <Button type="submit" style="success" size="auto" className="flex-1">
                        ✅ הוסף בעל עסק
                    </Button>
                    <Button type="button" onClick={goBack} style="secondary" size="auto">
                        ❌ ביטול
                    </Button>
                </div>
            </form>
        </div>
    );
}