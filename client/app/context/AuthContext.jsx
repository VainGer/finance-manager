import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const safeJsonParse = (str, fallback = null) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);
    const [storeUser, setStoreUser] = useState(true);
    const [storeProfile, setStoreProfile] = useState(true); 
    const [isLoading, setIsLoading] = useState(true);
    const [storageChecked, setStorageChecked] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const checkStorage = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        return keys;
      } catch (e) {
        return [];
      }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const rawAccount = await AsyncStorage.getItem('account');
                const rawProfile = await AsyncStorage.getItem('profile');
                
                if (rawAccount) {
                    const parsedAccount = safeJsonParse(rawAccount);
                    if (parsedAccount) {
                        setAccount(parsedAccount);
                        setStoreUser(true);
                    }
                }

                if (rawProfile) {
                    const parsedProfile = safeJsonParse(rawProfile);
                    if (parsedProfile) {
                        setProfile(parsedProfile);
                        setStoreProfile(true);
                    }
                }
            } catch (err) {
                console.error('Error loading auth data:', err);
            } finally {
                setStorageChecked(true);
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!storageChecked) return;
    }, [account, profile, pathname, storeUser, storeProfile, storageChecked]);

    // Store account changes
    useEffect(() => {
        if (!storageChecked) return;
        
        const storeAccount = async () => {
            try {
                if (account && storeUser) {
                    await AsyncStorage.setItem('account', JSON.stringify(account));
                } else if (!account) {
                    await AsyncStorage.removeItem('account');
                }
            } catch (err) {
                console.error('Error saving account:', err);
            }
        };
        storeAccount();
    }, [account, storeUser, storageChecked]);

    useEffect(() => {
        if (!storageChecked) return;
        
        const saveProfile = async () => {
            try {
                if (profile && storeProfile) {
                    // Safety check before storing
                    if (typeof profile === 'object' && profile !== null) {
                        const profileJson = JSON.stringify(profile);
                        await AsyncStorage.setItem('profile', profileJson);
                    }
                } else if (!profile) {
                    await AsyncStorage.removeItem('profile');
                }
            } catch (err) {
                console.error('Error saving profile:', err);
            }
        };
        saveProfile();
    }, [profile, storeProfile, storageChecked]);

    const logout = useCallback(async () => {
        try {
            setAccount(null);
            setProfile(null);
            await AsyncStorage.multiRemove(['account', 'profile']);
        } catch (err) {
            console.error('Error clearing auth data:', err);
        }
    }, []);

    const clearProfile = useCallback(async () => {
        try {
            setProfile(null);
            await AsyncStorage.removeItem('profile');
        } catch (err) {
            console.error('Error clearing profile:', err);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            account,
            profile,
            logout,
            clearProfile,
            isAuthenticated: !!account,
            hasActiveProfile: !!profile,
            storeUser,
            setStoreUser,
            storeProfile,
            setStoreProfile,
            setAccount,
            setProfile,
            isLoading,
            checkStorage
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
