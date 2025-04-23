import { useState, useEffect } from 'react';
import AddProfile from './AddProfile';
import AuthProfile from './AuthProfile';
import { motion } from 'framer-motion';
import { getProfiles } from '../../API/user';


const fadeInAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};


const buttonAnimation = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
};

export default function SelectProfile({ username, showSelectH1 }) {

    const [profiles, setProfiles] = useState([]);
    const [profileName, setProfileName] = useState('');
    const [parent, setParent] = useState(false);
    

    const [currentView, setCurrentView] = useState('profiles'); 

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const profileList = await getProfiles(username);
                setProfiles(profileList.profiles);
            } catch (error) {
                console.error("Error in fetchProfiles:", error);
            }
        }
        fetchProfiles();
    }, [username]);

    const showProfilesList = () => {
        setCurrentView('profiles');
        showSelectH1(true);
    };
    
    const showAddProfile = () => {
        setCurrentView('addProfile');
        showSelectH1(false);
    };
    
    const showAuthProfile = (name, isParent) => {
        setProfileName(name);
        setParent(isParent);
        setCurrentView('authProfile');
        showSelectH1(false);
    };

    const ProfilesList = () => (
        <>
            <motion.div
                {...fadeInAnimation}
                className="grid grid-cols-1 gap-4 w-full"
            >
                {profiles.map((profile, index) => (
                    <motion.button
                        key={index}
                        {...buttonAnimation}
                        transition={{ duration: 0 }}
                        className="w-full px-4 py-3 bg-blue-100 text-blue-700 font-medium rounded-lg shadow-md hover:bg-blue-200 transition"
                        onClick={() => showAuthProfile(profile.name, profile.parent)}
                    >
                        {profile.name}
                    </motion.button>
                ))}
            </motion.div>
            
            <motion.button
                {...buttonAnimation}
                className="mt-4 px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                onClick={showAddProfile}
            >
                הוסף פרופיל
            </motion.button>
        </>
    );

    const AddProfileView = () => (
        <motion.div
            {...fadeInAnimation}
            className="w-full *:text-center"
        >
            <AddProfile username={username} showSelectH1={showSelectH1} />
            <motion.button
                {...buttonAnimation}
                className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400 transition"
                onClick={showProfilesList}
            >
                חזרה לבחירת פרופיל
            </motion.button>
        </motion.div>
    );

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            {profiles.length > 0 ? (
                <div className="flex flex-col items-center gap-4">
                    {currentView === 'profiles' && <ProfilesList />}
                    
                    {currentView === 'authProfile' && (
                        <motion.div {...fadeInAnimation} className="w-full">
                            <AuthProfile 
                                username={username} 
                                profileName={profileName} 
                                parent={parent} 
                                backToSelect={showProfilesList} 
                            />
                        </motion.div>
                    )}
                    
                    {currentView === 'addProfile' && <AddProfileView />}
                </div>
            ) : (
                <motion.div
                    {...fadeInAnimation}
                    className="text-center"
                >
                    <h1 className="text-lg font-semibold text-gray-800">לא נמצאו פרופילים, צור פרופיל חדש</h1>
                    <AddProfile 
                        username={username}
                        showSelectH1={showSelectH1} 
                        firstProfile={true} 
                    />
                </motion.div>
            )}
        </div>
    );
}
