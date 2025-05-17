import { useState, useEffect } from "react";
import { getProfileCategories } from "../../API/category";

import ExpensesTable from "./ExpensesTable";

export default function ProfileExpenses({ username, profileName }) {

    const [expenses, setExpenses] = useState([]);

    async function fetchProfileCategories() {
        const response = await getProfileCategories(username, profileName);
        if (response.status === 200) {
            setExpenses(response.categories);
        } else {
            console.error("Failed to fetch profile categories");
        }
    }

    useEffect(() => {
        fetchProfileCategories();
    }, [username, profileName]);

    return (
        <div>
            <div>
                <div className="flex flex-wrap gap-3 justify-center items-center mb-6 px-4">
                    <button
                        className="min-w-[120px] px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium shadow-sm"
                    // onClick={() => {todo }}
                    >
                        סינון לפי תאריך
                    </button>
                    <button
                        className="min-w-[120px] px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium shadow-sm"
                    // onClick={() => {todo }}
                    >
                        סינון לפי קטגוריה
                    </button>
                    <button
                        className="min-w-[120px] px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base font-medium shadow-sm"
                    // onClick={() => {todo }}
                    >
                        בטל סינון
                    </button>

                </div>
            </div>
            <ExpensesTable username={username} profileName={profileName}
                expenses={expenses} forAccountView={false} fetchData={fetchProfileCategories} />
        </div>
    )
}