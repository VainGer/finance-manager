import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SelectProfile from '../components/SelectProfile';
import Header from '../components/Header';


export default function Account() {
    const location = useLocation();
    const username = location.state?.username;

    return (
        <div dir='rtl'>
            <Header username={username}></Header>
            <SelectProfile username={username}></SelectProfile>
        </div>
    );
}
