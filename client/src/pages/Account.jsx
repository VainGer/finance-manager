import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileList from '../components/ProfileList';


export default function Account() {
    const location = useLocation();
    const username = location.state?.username;

    return (
        <div dir='rtl'>
            <h1>הי, {username}, בחר את הפרופיל שלך</h1>
            <ProfileList username={username}></ProfileList>
        </div>
    );
}
