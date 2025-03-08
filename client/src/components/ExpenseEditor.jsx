import { useState, useEffect, useCallback } from 'react';
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
    const [showAddItem, setShowAddItem] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddCategoryBtn, setShowAddCategoryBtn] = useState(false);
    const [showDeleteCategory, setShowDeleteCategory] = useState(false);
    const [showDeleteCategoryMoveItem, setShowDeleteCategoryMoveItem] = useState(false);
    const [showRenameCategory, setShowRenameCategory] = useState(false);

    const onCategoryClick = (category) => {
        setChosenCategory(category);
        setShowCategories(false);
        setShowEditMenu(true);
    }

    function back() {
        setShowCategories(true);
        setShowEditMenu(false);
        setShowAddItem(false);
        setShowAddCategory(false);
        setShowAddCategoryBtn(true);
    }

    useEffect(() => {
        setShowAddCategoryBtn(!showAddCategoryBtn);
    }, [chosenCategory])

    return (
        <div className='grid gap-4 mt-8'>
            {showCategories && !showAddCategory && <h2>הקטגוריות שלך:</h2>}
            {showCategories && !showAddCategory && (
                <GetCats username={username} profileName={profileName} onCategoryClick={onCategoryClick} />
            )}
            {showEditMenu && (
                <div className='grid gap-4'>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition' onClick={() => {
                        setShowAddItem(!showAddItem);
                    }}>
                        הוסף פריט לקטגוריה
                    </button>
                    {showAddItem && (
                        <AddItem username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowAddItem} />

                    )}
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowDeleteCategory(true)}
                    >מחק קטגוריה ופריטים</button>
                    {showDeleteCategory &&
                        <RemoveCategory username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowDeleteCategory} />
                    }
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowDeleteCategoryMoveItem(true)}>
                        מחק קטגוריה והעבר פריטים לקטגוריה אחרת</button>
                    {showDeleteCategoryMoveItem &&
                        <RemoveCategoryMoveItem username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowDeleteCategoryMoveItem}
                        />
                    }
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowRenameCategory(true)}>
                        שנה שם לקטגוריה</button>
                    {showRenameCategory &&
                        <RenameCategory username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowRenameCategory} />
                    }
                    <SetPrivacy username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    <button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition' onClick={back}>חזרה</button>
                </div>
            )}
            {showAddCategory && (
                <div>
                    <AddCategory username={username} profileName={profileName} refreshExpenses={refreshExpenses} />
                    <button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition' onClick={back}>
                        חזרה</button>
                </div>
            )}
            {showAddCategoryBtn && <button
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                onClick={() => {
                    setShowAddCategory(!showAddCategory);
                    setShowCategories(!showCategories);
                    setShowAddCategoryBtn(false);
                }}
            >
                הוסף קטגוריה
            </button>}
        </div>
    );
}