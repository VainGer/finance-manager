import React from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

export default function Home() {



    const navigate = useNavigate();
    return (
        <>
            <title>דף הבית</title>
            <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
                <button onClick={() => navigate('/login')}>
                    התחברות
                </button>
                <button onClick={() => navigate('/register')}>
                    הרשמה
                </button>
            </div>
        </>
    );
}