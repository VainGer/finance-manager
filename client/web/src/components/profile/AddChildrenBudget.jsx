import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { post, get } from '../../utils/api';
import ErrorMessage from '../common/ErrorMessage';

export default function AddChildrenBudget() {
    const { account, profile } = useAuth();
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState(0);
    const [selectedChild, setSelectedChild] = useState('');
    const [childrenProfiles, setChildrenProfiles] = useState([]);

    const fetchChildrenProfiles = async () => {
        try {
            const response = await get('profile/get-profiles?username=' + account.username);
            if (response.ok) {
                setChildrenProfiles(response.profiles.filter(p => !p.parentProfile));
            } else {
                console.error('Error fetching children profiles:', response.error);
            }
        } catch (err) {
            console.error('Network error:', err);
        }
    }

    useEffect(() => {
        fetchChildrenProfiles();
    }, [profile]);

    const addChildrenBudget = async (e) => {
        e.preventDefault();
        try {
            const response = await post('profile/add-child-budget', {
                username: account.username,
                profileName: selectedChild,
                budget: {
                    startDate,
                    endDate,
                    amount: parseFloat(amount)
                }
            });
            if (response.ok) {
                console.log('Children budget added successfully', response);
            } else {
                setError('אירעה שגיאה בעת הוספת התקציב, נסה שוב מאוחר יותר');
                console.error('Error adding children budget:', response.error);
            }
        } catch (error) {
            setError('אירעה שגיאה בעת הוספת התקציב, נסה שוב מאוחר יותר');
            console.error('Error adding children budget:', error);
        }
    }

    return (<form onSubmit={addChildrenBudget}>
        {error && <ErrorMessage message={error} />}
        <select name="childProfile" value={selectedChild} onChange={e => setSelectedChild(e.target.value)}>
            <option value="">בחר ילד</option>
            {childrenProfiles.map((child, index) => {
                return <option key={index} value={child.profileName}>{child.profileName}</option>
            })}
        </select>
        <label>
            תאריך התחלה:
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
            תאריך סיום:
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <label>
            סכום:
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </label>
        <input type="submit" value="הוסף תקציב" />
    </form>)
}