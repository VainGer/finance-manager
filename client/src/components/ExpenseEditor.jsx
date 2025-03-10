import { useState, useEffect, useCallback, use } from 'react';
import GetCats from './GetCats';
import AddItem from './AddItem';
import AddCategory from './AddCategory';
import RemoveCategory from './RemoveCategory';
import RemoveCategoryMoveItem from './RemoveCategoryMoveItem';
import RenameCategory from './RenameCategory';
import SetPrivacy from './SetPrivacy';
import RenameItem from './RenameItem';
import MoveItem from './MoveItem';
import RemoveItem from './RemoveItem';
import SetProfBudget from './SetProfBudget';
import SetCategoryBudget from './SetCategoryBudget';


export default function ExpenseEditor({ username, profileName, refreshExpenses }) {
    const [chosenCategory, setChosenCategory] = useState("");
    const [showCategories, setShowCategories] = useState(true);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddCategoryBtn, setShowAddCategoryBtn] = useState(true);
    const [showDeleteCategory, setShowDeleteCategory] = useState(false);
    const [showDeleteCategoryMoveItem, setShowDeleteCategoryMoveItem] = useState(false);
    const [showRenameCategory, setShowRenameCategory] = useState(false);
    const [showRenameItem, setShowRenameItem] = useState(false);
    const [showMoveItem, setShowMoveItem] = useState(false);
    const [showRemoveItem, setShowRemoveItem] = useState(false);
    const [showSetBudget, setShowSetBudget] = useState(false);
    const [showSetCatBudget, setShowSetCatBudget] = useState(false);


    const onCategoryClick = (category) => {
        setChosenCategory(category);
        setShowCategories(false);
        setShowEditMenu(true);
        setShowAddCategoryBtn(false);
    }

    function back() {
        setShowCategories(true);
        setShowEditMenu(false);
        setShowAddItem(false);
        setShowAddCategory(false);
        setShowAddCategoryBtn(true);
    }

    return (
        <div className='relative my-6 grid h-110 overflow-y-auto border-1 rounded-md bg-blue-100 *:h-max *:mx-4'>
            {showCategories && !showAddCategory && (
                <GetCats username={username} profileName={profileName} onCategoryClick={onCategoryClick} />
            )}
            {showEditMenu && (
                <div className='grid gap-4 mt-4'>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition' onClick={() => {
                        setShowSetCatBudget(!showSetCatBudget);
                    }}>
                        הגדר תקציב לקטגוריה</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition' onClick={() => {
                        setShowAddItem(!showAddItem);
                    }}>
                        הוסף פריט לקטגוריה</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowRenameCategory(true)}>
                        שנה שם לקטגוריה</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowRenameItem(!showRenameItem)}>
                        שנה שם פריט</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowMoveItem(!showMoveItem)}>
                        העבר פריט לקטגוריה חדשה</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowDeleteCategory(true)}
                    >מחק קטגוריה ופריטים</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowDeleteCategoryMoveItem(true)}>
                        מחק קטגוריה והעבר פריטים לקטגוריה אחרת</button>
                    <button className='px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition'
                        onClick={(e) => setShowRemoveItem(!showRemoveItem)}>
                        מחק פריט</button>
                    {showSetCatBudget &&
                        <SetCategoryBudget username={username} profileName={profileName}
                            category={chosenCategory} showConfirm={setShowSetCatBudget} refreshExpenses={refreshExpenses} />
                    }
                    {showAddItem &&
                        <AddItem username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowAddItem} />
                    }
                    {showDeleteCategory &&
                        <RemoveCategory username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowDeleteCategory} />
                    }
                    {showDeleteCategoryMoveItem &&
                        <RemoveCategoryMoveItem username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses} showConfirm={setShowDeleteCategoryMoveItem}
                        />
                    }
                    {showRenameCategory &&
                        <RenameCategory username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowRenameCategory} />
                    }
                    {
                        showRenameItem &&
                        <RenameItem username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowRenameItem} />
                    }
                    {
                        showMoveItem &&
                        <MoveItem username={username} profileName={profileName}
                            category={chosenCategory} refreshExpenses={refreshExpenses}
                            showConfirm={setShowMoveItem} />
                    }
                    {
                        showRemoveItem &&
                        <RemoveItem username={username} profileName={profileName} category={chosenCategory}
                            refreshExpenses={refreshExpenses} showConfirm={setShowRemoveItem} />
                    }
                    <SetPrivacy username={username} profileName={profileName} category={chosenCategory} refreshExpenses={refreshExpenses} />
                    <button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition'
                        onClick={back}>חזרה</button>
                </div>
            )}
            {showAddCategory && (
                <div>
                    <AddCategory username={username} profileName={profileName} refreshExpenses={refreshExpenses} />
                    <button className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition' onClick={back}>
                        חזרה</button>
                </div>
            )}
            {showAddCategoryBtn && <div className='grid *:mt-4'>
                <button
                    className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition'
                    onClick={() => {
                        setShowAddCategory(!showAddCategory);
                        setShowCategories(!showCategories);
                        setShowAddCategoryBtn(false);
                    }}
                >
                    הוסף קטגוריה
                </button>
                <button className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition' onClick={() => {
                    setShowSetBudget(!showSetBudget);
                }}>
                    הגדר תקציב פרופיל
                </button>
                {
                    showSetBudget && (
                        <SetProfBudget username={username}
                            profileName={profileName}
                            category={chosenCategory}
                            refreshExpenses={refreshExpenses}
                            showConfirm={setShowSetBudget}
                        />
                    )
                }
            </div>
            }
        </div>
    );
}