import { useEffect, useState } from "react";
import ProfileExpenses from "./ProfileExpenses";

export default function ExpensesByBudget({ username, profileName }) {
    const [profBudgets, setProfBudgets] = useState([]);
    const [catBudgets, setCatBudgets] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [category, setCategory] = useState("");
    const [showProfBudgets, setShowProfBudgets] = useState(false);
    const [showCatBudgets, setShowCatBudgets] = useState(false);
    const [showTable, setShowTable] = useState(false);

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


    function setDates(e) {
        const selectedOption = e.target.selectedOptions[0];
        setStartDate(selectedOption.dataset.startdate);
        setEndDate(selectedOption.dataset.enddate);
    }


    function setDatesAndCategory(e) {
        const selectedOption = e.target.selectedOptions[0];
        setStartDate(selectedOption.dataset.startdate);
        setEndDate(selectedOption.dataset.enddate);
        setCategory(selectedOption.dataset.category);
    }

    return (
        <div>
            <div className="mb-4 flex-col *:py-2 *:px-2 *:bg-blue-500 *:text-white *:rounded-md *:mx-1 *:hover:bg-blue-600 *:h-max">
                <button onClick={(e) => {
                    setShowProfBudgets(!showProfBudgets);
                    setShowCatBudgets(false)
                    setShowTable(false);
                }}
                >לצפות בתקופת תקציב כללית</button>
                <button onClick={(e) => {
                    setShowProfBudgets(false);
                    setShowCatBudgets(!showCatBudgets);
                    setShowTable(false);
                }}
                >לצפות בתקופת תקציב לקטגוריות</button>
            </div>
            {showProfBudgets && (
                profBudgets.length > 0 ? (
                    <div className="grid">
                        <select className="text-center" onChange={(e) => setDates(e)}>
                            <option selected disabled>בחר תקופת תקציב</option>
                            {profBudgets.map((budget, index) => {
                                return (<option data-startdate={budget.startDate} data-enddate={budget.endDate}
                                    key={index}>
                                    {budget.startDate} - {budget.endDate}</option>)
                            })}
                        </select>
                        <div className="*:mx-2 *:p-2 mb-3">
                            <button
                                className=" bg-blue-500 text-white rounded-md hover:bg-blue-600 h-max w-max mx-auto mt-4"
                                onClick={(e) => {
                                    setShowCatBudgets(false);
                                    setShowTable(true);
                                }}
                            >הצג תוצאות</button>
                            <button className=" bg-blue-500 text-white rounded-md hover:bg-blue-600 h-max w-max mx-auto mt-4"
                                onClick={(e) => setShowTable(false)}>
                                סגור טבלה
                            </button>
                        </div>
                    </div>
                )
                    : (
                        <p>לא נמצאו הגדרות תקציב לפרופיל</p>
                    )
            )}
            {showCatBudgets && (
                catBudgets.length > 0 ? (
                    <div className="grid">
                        <select className="text-center" onChange={(e) => setDatesAndCategory(e)}>
                            <option selected disabled>בחר תקופת תקציב וקטגוריה</option>
                            {catBudgets.map((budget, index) => {
                                return (<option data-category={budget.category} data-startdate={budget.startDate} data-enddate={budget.endDate}
                                    key={index}>
                                    {budget.category} - {budget.startDate} - {budget.endDate}</option>)
                            })}
                        </select>
                        <div className="*:mx-2 *:p-2 mb-3">
                            <button
                                className=" bg-blue-500 text-white rounded-md hover:bg-blue-600 h-max w-max mx-auto mt-4"
                                onClick={(e) => {
                                    setShowProfBudgets(false);
                                    setShowTable(true);
                                }}
                            >הצג תוצאות</button>
                            <button className=" bg-blue-500 text-white rounded-md hover:bg-blue-600 h-max w-max mx-auto mt-4"
                                onClick={(e) => setShowTable(false)}>
                                סגור טבלה
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>לא נמצאו הגדרות תקציב לקטגוריות</p>
                )
            )}
            {showTable &&
                <ProfileExpenses username={username} profileName={profileName} showFilterDatesBtn={true} />
            }
        </div>
    );
}