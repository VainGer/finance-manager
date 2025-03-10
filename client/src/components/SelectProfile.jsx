import { useState, useEffect } from 'react';
import AddProfile from './AddProfile';
import AuthProfile from './AuthProfile';
import { motion } from 'framer-motion';

export default function SelectProfile({ username }) {
    const [profiles, setProfiles] = useState([]);
    const [toggleProfiles, setToggleProfiles] = useState(true);
    const [toggleAddProfiles, setToggleAddProfiles] = useState(false);
    const [toggleAddBtn, setToggleAddBtn] = useState(true);
    const [toggleAuthProfile, setToggleAuthProfile] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [parent, setParent] = useState(false);

    async function getProfiles() {
        try {
            let response = await fetch('http://localhost:5500/api/user/get-profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            let data = await response.json();
            if (response.ok) {
                return data.profiles;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchProfiles() {
            const profiles = await getProfiles();
            if (profiles) {
                setProfiles(profiles);
            }
        }
        fetchProfiles();
    }, [username]);

    function backToSelect() {
        setToggleProfiles(true);
        setToggleAddProfiles(false);
        setToggleAddBtn(true);
        setToggleAuthProfile(false);
    }


    return (
        <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            {profiles.length > 0 ? (
                <div className="flex flex-col items-center gap-4">
                    {toggleProfiles && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 gap-4 w-full"
                        >
                            {profiles.map((profile, index) => (
                                <motion.button
                                    transition={{ duration: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={index}
                                    className="w-full px-4 py-3 bg-blue-100 text-blue-700 font-medium rounded-lg shadow-md hover:bg-blue-200 transition"
                                    onClick={() => {
                                        setProfileName(profile.pName);
                                        setParent(profile.parent);
                                        setToggleAuthProfile(true);
                                        setToggleProfiles(false);
                                        setToggleAddBtn(false);
                                    }}
                                >
                                    {profile.pName}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {toggleAuthProfile && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <AuthProfile username={username} profileName={profileName} parent={parent} backToSelect={backToSelect} />
                        </motion.div>
                    )}

                    {toggleAddBtn && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-4 px-6 py-3 bg-green-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-green-700 transition"
                            onClick={() => {
                                setToggleProfiles(false);
                                setToggleAddProfiles(true);
                                setToggleAddBtn(false);
                            }}
                        >
                            הוסף פרופיל
                        </motion.button>
                    )}

                    {toggleAddProfiles && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <AddProfile username={username} />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:bg-gray-400 transition"
                                onClick={() => {
                                    setToggleProfiles(true);
                                    setToggleAddProfiles(false);
                                    setToggleAddBtn(true);
                                }}
                            >
                                חזרה לבחירת פרופיל
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-lg font-semibold text-gray-800">לא נמצאו פרופילים, צור פרופיל חדש</h1>
                    <AddProfile username={username} />
                </motion.div>
            )}
        </div>
    );
}
