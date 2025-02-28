import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {

    const location = useLocation();
    const [username, setUsename] = useState(location.state?.username);
    const [profileName, setProfileName] = useState(location.state?.profileName);



    return (<>
        <div>
            <h1>Dashboard</h1>
            <h2>Hi, {username}! Welcome to your dashboard</h2>
            <h3>Profile: {profileName}</h3>
        </div>
    </>);
}