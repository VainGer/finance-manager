import { useState } from 'react';
import { post } from '../../utils/api';
import Button from '../common/Button';

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
        if (!profileName || !pin || profileName.trim() === '' || pin.trim() === '') {
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
        const parent = firstProfile ? true : parentProfile;
        const newProfile = {
            username,
            profileName,
            pin,
            avatar: avatar ? avatarBase64 : null,
            color,
            parentProfile: parent
        }

        const uri = parent ? "create-profile" : "create-child-profile";

        const response = await post(`profile/${uri}`, newProfile);

        if (response.ok) {
            if (firstProfile) {
                window.location.reload();
            } else if (onProfileCreated) {
                setProfileName('');
                setPin('');
                setAvatar(null);
                setColor('#000000');
                setParentProfile(false);
                onProfileCreated();
            }
        } else {
            setError(response.message || 'Failed to create profile.');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">יצירת פרופיל חדש</h2>
                            <p className="text-white/80 text-sm">הוסף פרופיל חדש למערכת ניהול הכספים</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="text-red-700 font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={createProfile} className="space-y-6">
                        {/* Profile Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">שם פרופיל</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="הכנס שם פרופיל"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    className="w-full p-4 pr-12 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* PIN */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">קוד סודי (4 ספרות)</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="●●●●"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="w-full p-4 pr-12 text-center text-2xl tracking-widest border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200 bg-white shadow-sm font-mono"
                                    maxLength="4"
                                    pattern="\d{4}"
                                    required
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-200">
                                הקוד חייב להכיל בדיוק 4 ספרות
                            </p>
                        </div>

                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">תמונת פרופיל (אופציונלי)</label>
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-lg flex items-center justify-center">
                                        {avatar ? (
                                            <img src={URL.createObjectURL(avatar)} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-right">
                                        <label
                                            htmlFor="avatar-upload"
                                            className="inline-flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-50 py-3 px-6 border-2 border-slate-300 hover:border-slate-400 rounded-xl shadow-sm text-sm font-medium text-slate-700 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {avatar ? 'שנה תמונה' : 'בחר תמונה'}
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setAvatar(e.target.files[0])}
                                        />
                                        {avatar && (
                                            <p className="text-sm text-slate-600 mt-2 font-medium">
                                                {avatar.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">צבע פרופיל</label>
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <div className="grid grid-cols-6 gap-3 mb-4">
                                    {[
                                        { color: '#FF0000', name: 'אדום' },
                                        { color: '#00AA00', name: 'ירוק' },
                                        { color: '#0066FF', name: 'כחול' },
                                        { color: '#FFD700', name: 'צהוב' },
                                        { color: '#FF6B35', name: 'כתום' },
                                        { color: '#800080', name: 'סגול' },
                                        { color: '#FF1493', name: 'ורוד' },
                                        { color: '#20B2AA', name: 'טורקיז' },
                                        { color: '#4B0082', name: 'אינדיגו' },
                                        { color: '#708090', name: 'אפור' },
                                        { color: '#8B4513', name: 'חום' },
                                        { color: '#2E8B57', name: 'ירוק ים' },
                                        { color: '#FFFFFF', name: 'לבן' },
                                        { color: '#A52A2A', name: 'אדום חום' },
                                        { color: '#00CED1', name: 'טורקיז כהה' },
                                        { color: '#DAA520', name: 'זהב כהה' },
                                        { color: '#C0C0C0', name: 'כסף' },
                                        { color: '#ADFF2F', name: 'ירוק בהיר' },
                                    ].map(({ color: colorValue, name }) => (
                                        <button
                                            key={colorValue}
                                            type="button"
                                            onClick={() => setColor(colorValue)}
                                            className={`w-12 h-12 rounded-xl border-4 transition-all duration-200 hover:scale-110 hover:shadow-lg ${color === colorValue
                                                    ? 'border-slate-800 shadow-lg transform scale-105'
                                                    : 'border-slate-300 hover:border-slate-500'
                                                }`}
                                            style={{ backgroundColor: colorValue }}
                                            title={name}
                                        />
                                    ))}
                                </div>
                                <div className="text-center text-sm text-slate-600 bg-white rounded-lg p-3 border border-slate-200">
                                    צבע נבחר: <span className="font-semibold" style={{ color: color }}>
                                        {[
                                            { color: '#FF0000', name: 'אדום' }, { color: '#00AA00', name: 'ירוק' }, { color: '#0066FF', name: 'כחול' },
                                            { color: '#FFD700', name: 'צהוב' }, { color: '#FF6B35', name: 'כתום' }, { color: '#800080', name: 'סגול' },
                                            { color: '#FF1493', name: 'ורוד' }, { color: '#20B2AA', name: 'טורקיז' }, { color: '#4B0082', name: 'אינדיגו' },
                                            { color: '#708090', name: 'אפור' }, { color: '#8B4513', name: 'חום' }, { color: '#2E8B57', name: 'ירוק ים' }
                                        ].find(c => c.color === color)?.name || 'לא ידוע'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Parent Profile Checkbox */}
                        {!firstProfile && (
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                                        checked={parentProfile}
                                        onChange={(e) => setParentProfile(e.target.checked)}
                                    />
                                    <div>
                                        <label className="text-sm font-semibold text-blue-800">הגדר כפרופיל הורה</label>
                                        <p className="text-xs text-blue-700 mt-1">פרופיל הורה יכול לנהל תקציבים של פרופילי ילדים</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200">
                            <Button
                                type="submit"
                                className="w-full px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    צור פרופיל חדש
                                </div>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
