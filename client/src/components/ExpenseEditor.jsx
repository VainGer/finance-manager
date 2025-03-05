import { useState, useEffect, use } from 'react';
import GetCats from './GetCats';
import AddTransact from './AddTransact'
import AddItem from './AddItem';
import AddCategory from './AddCategory'
import RemoveCategory from './RemoveCategory';
import RemoveCategoryMoveItem from './RemoveCategoryMoveItem';
import RenameCategory from './RenameCategory';
import SetPrivacy from './SetPrivacy';
export default function ExpenseEditor({ username, profileName }) {
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

    function back(e) {
        setShowCategories(true);
        setShowAddTransact(false);
        setShowEditMenu(false);
        setShowAddItem(false);
        setShowAddCategory(false);
    }

    return (
        <div className='grid'>
            <button onClick={(e) => {
                setShowAddTransact(true);
                setShowAddItem(false);
                setShowAddCategory(true);
                setShowCategories(false);
            }}>הוסף קטגוריה</button>
            {showCategories && <GetCats username={username} profileName={profileName} onCategoryClick={onCategoryClick} />}
            {showEditMenu && <div className='grid'>
                <button onClick={(e) => {
                    setShowAddTransact(true);
                    setShowAddItem(false);
                    setShowAddCategory(false);
                }} > הוסף עסקה</button>
                {showAddTransact && <AddTransact username={username} profileName={profileName} category={chosenCategory}></AddTransact>}
                <button onClick={(e) => {
                    setShowAddTransact(false);
                    setShowAddItem(true);
                    setShowAddCategory(false);
                }}>הוסף פריט לקטגוריה</button>
                {showAddItem && <AddItem username={username} profileName={profileName} category={chosenCategory}></AddItem>}
                <RemoveCategory username={username} profileName={profileName} />
                <RemoveCategoryMoveItem username={username} profileName={profileName} category={chosenCategory}></RemoveCategoryMoveItem>
                {showAddCategory && <AddCategory username={username} profileName={profileName} />}
                {<RenameCategory username={username} profileName={profileName} category={chosenCategory} />}
                {<SetPrivacy username={username} profileName={profileName} category={chosenCategory} />}
                <button onClick={(e) => back(e)}>חזרה</button>
            </div >}
        </div >
    )
}