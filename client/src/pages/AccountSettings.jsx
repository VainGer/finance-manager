import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RenameProfileName from "../components/RenameProfileName";
import Header from "../components/Header";
import ChangePinCode from "../components/ChangePinCode";
import DeleteProfile from "../components/DeleteProfile";
import { motion } from "framer-motion";

export default function AccountSettings() {
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state?.username;
    const [profileName, setProfileName] = useState(location.state?.profileName);
    const parent = location.state?.parent;
    const [showRenameProfile, setShowRenameProfile] = useState(false);
    const [showChangePinCode, setShowChangePinCode] = useState(false);
    const [showDeleteProfile, setShowDeleteProfile] = useState(false);
    const [showBtns, setShowBtns] = useState(true);

    useEffect(() => {
        if (!username || !profileName) navigate('/', { state: { notLogedIn: true } });;
    }, [username, profileName]);

    return (
        <div dir="rtl" className="min-h-screen bg-gray-100">
            <Header username={username} profileName={profileName} parent={parent} />

            <div className="w-full max-w-md mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">הגדרות פרופיל</h2>

                {showBtns && (
                    <div className="grid gap-4">
                        <button
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
                            onClick={() => {
                                setShowRenameProfile(true);
                                setShowBtns(false);
                            }}
                        >
                            שנה שם פרופיל
                        </button>
                        <button
                            className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition"
                            onClick={() => {
                                setShowChangePinCode(true);
                                setShowBtns(false);
                            }}
                        >
                            שנה קוד סודי
                        </button>
                        <button
                            className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                            onClick={() => {
                                setShowDeleteProfile(true);
                                setShowBtns(false);
                            }}
                        >
                            מחק פרופיל
                        </button>


                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-2 px-4 py-2 text-sm bg-gray-400 text-white font-medium rounded-md shadow-sm hover:bg-gray-500 transition"
                            onClick={() => navigate('/dashboard', { state: { username, profileName, parent } })}
                        >
                            חזרה
                        </motion.button>
                    </div>
                )}

                {showRenameProfile && (
                    <RenameProfileName
                        username={username}
                        profileName={profileName}
                        setProfileName={setProfileName}
                        setShowBtns={setShowBtns}
                        setShowRenameProfile={setShowRenameProfile}
                    />
                )}
                {showChangePinCode && (
                    <ChangePinCode
                        username={username}
                        profileName={profileName}
                        setShowBtns={setShowBtns}
                        setShowChangePinCode={setShowChangePinCode}
                    />
                )}
                {showDeleteProfile && (
                    <DeleteProfile
                        username={username}
                        profileName={profileName}
                        setShowBtns={setShowBtns}
                        setShowDeleteProfile={setShowDeleteProfile}
                    />
                )}
            </div>
        </div>
    );
}
