import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileBudgetDisplay from '../components/dashboard/ProfileBudgetDisplay';
import SideMenu from '../components/dashboard/SideMenu';
import DisplaySelector from '../components/dashboard/DisplaySelector';
import Navbar from '../components/Navbar';
export default function Dashboard() {

    const { profile } = useAuth();
    const { account } = useAuth();

    const [display, setDisplay] = useState(<ProfileBudgetDisplay profile={profile} />);

    return (
        <>
            <Navbar />
            <div>
                <DisplaySelector setDisplay={setDisplay} />
            </div>
            <div className='grid grid-cols-2'>
                <SideMenu />
                {display}
            </div>
        </>
    );
}