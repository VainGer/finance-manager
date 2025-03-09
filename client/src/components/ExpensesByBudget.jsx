import { useEffect, useState } from "react";

export default function ExpensesByBudget({ username, profileName }) {
    const [profBudgets, setProfBudgets] = useState([]);
    const [catBudgets, setCatBudgets] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    async function getProfBudgetsDates() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_prof_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                return data.budget;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getCatBudgets() {
        try {
            let response = await fetch('http://localhost:5500/api/profile/get_cat_budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName })
            });
            let data = await response.json();
            if (response.ok) {
                return data.budget;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function fetchBudgets() {
        const profBudgets = await getProfBudgetsDates();
        const catBudgets = await getCatBudgets();
        if (profBudgets) {
            setProfBudgets(profBudgets);
        }
        if (catBudgets) {
            setCatBudgets(catBudgets);
        }
    }

    useEffect(() => {
        fetchBudgets();
    }, [username, profileName]);

    function setDates() {

    }

    return (
        <div>
            {profBudgets.length > 0 ? (
                <select className="text-center" onChange={(e) => setDates()}>
                    <option selected disabled>בחר תקופת תקציב</option>
                    {profBudgets.map((budget, index) => {
                        return (<option key={index}>
                            {budget.startDate} - {budget.endDate}</option>)
                    })}
                </select>
            ) : (
                <p>לא נמצאו הגדרות תקציב לפרופיל</p>
            )}
            {
                catBudgets.length > 0 ? (
                    <select className="text-center" onChange={(e) => setDates()}>
                        <option selected disabled>בחר תקופת תקציב</option>
                        {catBudgets.map((budget, index) => {
                            console.log(budget);
                            return (<option key={index}>
                                {budget.categoryName} - {budget.startDate} - {budget.endDate}</option>)
                        })}
                    </select>
                ) : (
                    <p>לא נמצאו הגדרות תקציב לקטגוריות</p>
                )
            }
        </div>
    );
}