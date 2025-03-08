import { useState, useEffect, use } from "react";
import { useLocation } from "react-router-dom";
import RenameProfileName from "../components/RenameProfileName"
import Header from "../components/Header"
import ChangePinCode from "../components/ChangePinCode";
import DeleteProfile from "../components/DeleteProfile";

export default function AccountSettings() {
    const location = useLocation();
    const username = location.state?.username;
    const [profileName, setProfileName] = useState(location.state?.profileName);
    const parent = location.state?.parent;
    const [showRenameProfile, setShowRenameProfile] = useState(false);
    const [showChangePinCode, setShowChangePinCode] = useState(false);
    const [showDeleteProfile, setShowDeleteProfile] = useState(false);
    const [showBtns, setShowBtns] = useState(true);

    return (<div dir="rtl">
        <Header username={username} profileName={profileName} parent={parent} />
        <div className="grid w-max mx-auto mt-32 *:border-1">
            {showBtns && <div className="grid *:border-1">
                <button onClick={(e) => { setShowRenameProfile(!showRenameProfile); setShowBtns(false) }}>
                    שנה שם פרופיל
                </button    >
                <button onClick={(e) => { setShowChangePinCode(!showChangePinCode); setShowBtns(false) }}>
                    שנה קוד סודי
                </button>
                <button onClick={(e) => { setShowDeleteProfile(!showDeleteProfile); setShowBtns(false) }}>
                    מחק פרופיל
                </button>
            </div>}
            {showRenameProfile &&
                <RenameProfileName username={username} profileName={profileName}
                    setProfileName={setProfileName} setShowBtns={setShowBtns}
                    setShowRenameProfile={setShowRenameProfile}
                />}
            {showChangePinCode &&
                <ChangePinCode username={username} profileName={profileName}
                    setShowBtns={setShowBtns} setShowChangePinCode={setShowChangePinCode}
                />}
            {showDeleteProfile &&
                <DeleteProfile username={username} profileName={profileName}
                    setShowBtns={setShowBtns} setShowDeleteProfile={setShowDeleteProfile}
                />}
        </div>
    </div>)
}