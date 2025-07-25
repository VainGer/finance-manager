import { useState } from 'react';
import { post } from '../../utils/api';

const toBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default function CreateProfile({ username, firstProfile, onProfileCreated }) {

    const [profileName, setProfileName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [color, setColor] = useState('#000000');
    const [pin, setPin] = useState('');
    const [parentProfile, setParentProfile] = useState(false);
    const [error, setError] = useState('');

    const createProfile = async (e) => {
        e.preventDefault();
        if (!profileName || !pin) {
            setError('Profile name and PIN are required.');
            return;
        }
        setError('');
        let avatarBase64 = null;
        if (avatar) {
            try {
                avatarBase64 = await toBase64(avatar);
            } catch (error) {
                setError('Failed to upload avatar.');
                return;
            }
        }
        console.log(avatarBase64);
        const response = await post('profile/create-profile', {
            username,
            profileName,
            pin,
            avatar: avatar ? avatarBase64 : null,
            color,
            parentProfile: firstProfile || parentProfile,
        });

        if (response.ok) {
            if (onProfileCreated) {
                onProfileCreated(response.profile);
            }
        } else {
            setError(response.message || 'Failed to create profile.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">הוספת פרופיל</h2>
                {error && <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">{error}</p>}
                <form onSubmit={createProfile} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם פרופיל</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="הכנס שם פרופיל"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">קוד סודי</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 text-right border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="הכנס קוד סודי (4 ספרות)"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength="4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">הוסף תמונת פרופיל</label>
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="avatar-upload"
                                className="w-full cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <span>בחר קובץ</span>
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                            {avatar && <span className="text-sm text-gray-500">{avatar.name}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">בחר צבע</label>
                        <input
                            type="color"
                            className="w-full h-10 p-1 border border-gray-300 rounded-md"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                    {!firstProfile && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={parentProfile}
                                onChange={(e) => setParentProfile(e.target.checked)}
                            />
                            <label className="text-sm text-gray-900">הגדר כפרופיל הורה</label>
                        </div>
                    )}
                    <button
                        className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        type="submit"
                    >
                        צור פרופיל
                    </button>
                </form>
            </div>
        </div>
    );
}
