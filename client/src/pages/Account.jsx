import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SelectProfile from '../components/SelectProfile';


export default function Account() {
    const location = useLocation();
    const username = location.state?.username;

    return (
        <div dir='rtl'>
            <SelectProfile username={username}></SelectProfile>
        </div>
    );
}
