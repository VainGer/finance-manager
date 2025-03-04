import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountExpenses from '../components/AccountExpenses';
import ProfileExpenses from '../components/ProfileExpenses';
import AddCategory from '../components/AddCategory';
import EditCategories from '../components/EditCategories';
export default function Dashboard() {

    const location = useLocation();
    const [username, setUsename] = useState(location.state?.username);
    const [profileName, setProfileName] = useState(location.state?.profileName);
    const [parent, setParent] = useState(location.state?.parent);
    console.log(parent)
    const [showAccExpenses, setShowAccExpenses] = useState(false);
    const [showProfExpenses, setShowProfExpenses] = useState(false);


    return (<>
        <div dir='rtl'>
            <div className='grid place-items-center'>
                <h1>Dashboard</h1>
                <h2>Hi, {username}! Welcome to your dashboard</h2>
                <h3>Profile: {profileName}</h3>
                <div className='grid grid-cols-2 w-max gap-2 *:border-1 *:hover:bg-blue-200 *:hover:cursor-pointer'>
                    <button onClick={(e) => { setShowProfExpenses(!showProfExpenses); setShowAccExpenses(false) }}>הצג הוצאות בפרופיל שלך</button>
                    <button onClick={(e) => { setShowAccExpenses(!showAccExpenses); setShowProfExpenses(false) }}>הצג הוצאות בכל הפרופילים</button>
                </div>
                {showAccExpenses && <AccountExpenses username={username} profileName={profileName}></AccountExpenses>}
                {showProfExpenses && <ProfileExpenses username={username} profileName={profileName}></ProfileExpenses>}
            </div>
            <AddCategory username = {username} profileName= {profileName}></AddCategory>
            <div><EditCategories username={username} profileName={profileName}/></div>
        </div>
    </>);
}