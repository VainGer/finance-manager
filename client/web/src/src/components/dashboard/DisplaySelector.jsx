import ProfileBudgetDisplay from "./ProfileBudgetDisplay";
import { useAuth } from '../../context/AuthContext';


export default function DisplaySelector({ setDisplay }) {

    const { profile } = useAuth();

    const expenses = <>
        <h2>הוצאות</h2>
    </>

    const summary = <>
        <h2>סיכום הוצאות</h2>
    </>

    return (
        <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={() => setDisplay(expenses)}>הוצאות</button>
            <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={() => setDisplay(summary)}>סיכום הוצאות</button>
        </>
    );
}