import { usePathname, useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const profileDataContext = createContext();

export default function ProfileData() {
    const [categories, setCategories] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const { profile } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    
}
