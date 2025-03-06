import { useState, useEffect } from 'react';
import GetCats from './GetCats';
import AddTransact from './AddTransact';
import AddItem from './AddItem';
import AddCategory from './AddCategory';
import RemoveCategory from './RemoveCategory';
import RemoveCategoryMoveItem from './RemoveCategoryMoveItem';
import RenameCategory from './RenameCategory';
import SetPrivacy from './SetPrivacy';

export default function ExpenseEditor({ username, profileName, refreshExpenses }) {
    const [chosenCategory, setChosenCategory] = useState("");
    const [showCategories, setShowCategories] = useState(true);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [showAddTransact, setShowAddTransact] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);

    const onCategoryClick = (category) => {
        setChosenCategory(category);
        setShowCategories(false);
        setShowEditMenu(true);
    }

    function back() {
        setShowCategories(true);
        setShowAddTransact(false);
        setShowEditMenu(false);
        setShowAddItem(false);
        setShowAddCategory(false);
    }

    return (
        <div className='grid gap-4'>
            <button
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                onClick={() => {
                    setShowAddCategory(!showAddCategory);
                    setShowCategories(!showCategories);
                }}
            >
                הוסף קטגוריה
            </button>
            {showCategories && !showAddCategory && <h2>הקטגוריות שלך:</h2>}
            {showCategories && !showAddCategory && (
                <GetCats username={username} profileName={profileName} onCategoryClick={onCategoryClick} />
            )}

            {showAddCategory && (
                <div>
                    <AddCategory username={username} profileName={profileName} refreshExpenses={refreshExpenses} />
                    <button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition' onClick={back}>חזרה</button>
                </div>
            )}

            {showEditMenu && (
                <div className='grid gap-4'>
                    <button className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition' onClick={() => {
                        setShowAddTransact(!showAddTransact);
                        setShowAddItem(false);
                    }}>
                        הוסף עסקה
                    </button>
                    {showAddTransact && (
                        <AddTransact username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    )}

                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition' onClick={() => {
                        setShowAddItem(!showAddItem);
                        setShowAddTransact(false);
                    }}>
                        הוסף פריט לקטגוריה
                    </button>
                    {showAddItem && (
                        <AddItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    )}

                    <RemoveCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    <RemoveCategoryMoveItem username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    <RenameCategory username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    <SetPrivacy username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    <button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition' onClick={back}>חזרה</button>
                </div>
            )}
        </div>
    );
}