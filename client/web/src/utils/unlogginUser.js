import { useStae, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


const { account, profile } = useAuth();
const { setAccount, setProfile } = useAuth();


useEffect(() => {
    setAccount(null);
    setProfile(null);
}, [setAccount, setProfile]);