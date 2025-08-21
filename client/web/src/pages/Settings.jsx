import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddChildrenBudget from '../components/profile/AddChildrenBudget';
import CreateProfile from '../components/profile/CreateProfile';
import useSettingsState from '../hooks/useSettingsState';
import NavigationHeader from '../components/layout/NavigationHeader';
import PageLayout from '../components/layout/PageLayout';
import Sidebar from '../components/settings/Sidebar';
import ProfileInfo from '../components/settings/ProfileInfo';
import PinChange from '../components/settings/PinChange';
import AvatarManager from '../components/settings/AvatarManager';
import DeleteProfile from '../components/settings/DeleteProfile';
import MessageBanner from '../components/settings/MessageBanner';
import PasswordChange from '../components/settings/PasswordChange';
import Button from '../components/common/Button';

export default function Settings() {
    const { account, profile, setAccount, setProfile } = useAuth();
    const navigate = useNavigate();
    const {
        state: {
            activeSection,
            editMode,
            profileForm,
            avatarForm,
            deleteConfirmation,
            passwordForm,
            pinForm,
            message,
            sections
        },
        actions: {
            updateProfile,
            setActiveSection,
            setEditMode,
            setProfileForm,
            setAvatarForm,
            setDeleteConfirmation,
            setPasswordForm,
            setPinForm,
            setMessage,
            handleLogout,
            handleSwitchProfile,
            handleProfileEdit,
            handlePasswordChange,
            handlePinChange,
            handleCancel,
            handleAvatarSelect,
            handleAvatarUpload,
            handleRemoveAvatar,
            handleDeleteProfile,
            confirmDeleteProfile,
            cancelDeleteProfile
        }
    } = useSettingsState({ account, profile, setAccount, setProfile, navigate });

    const renderProfileSection = () => (
        <div className="space-y-6">
            <ProfileInfo
                profile={profile}
                account={account}
                editMode={editMode.profile}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                onSave={handleProfileEdit}
                onCancel={() => handleCancel('profile')}
                onSwitchProfile={handleSwitchProfile}
            />

            <PinChange
                editMode={editMode.pin}
                pinForm={pinForm}
                setPinForm={setPinForm}
                onSave={handlePinChange}
                onCancel={() => handleCancel('pin')}
            />

            <AvatarManager
                profile={profile}
                avatarForm={avatarForm}
                onSelect={handleAvatarSelect}
                onUpload={handleAvatarUpload}
                onRemove={handleRemoveAvatar}
            />

            <DeleteProfile
                profileName={profile?.profileName}
                isOpen={deleteConfirmation.isOpen}
                pin={deleteConfirmation.pin}
                setPin={(val) => setDeleteConfirmation(prev => ({ ...prev, pin: val }))}
                onOpen={handleDeleteProfile}
                onConfirm={confirmDeleteProfile}
                onCancel={cancelDeleteProfile}
            />
        </div>
    );

    const renderAccountSection = () => (
        <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">פרטי חשבון</h3>
                            <p className="text-white/80 text-sm">מידע על החשבון הראשי במערכת</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">שם משתמש</label>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-slate-800">
                                        {account?.username || 'לא זמין'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">אימייל</label>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="font-semibold text-slate-800">
                                        {account?.email || 'לא זמין'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <Button
                            onClick={handleLogout}
                            style="danger"
                            size="auto"
                            className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            התנתק מהמערכת
                        </Button>
                    </div>
                </div>
            </div>

            <PasswordChange
                editMode={editMode.password}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                onSave={handlePasswordChange}
                onCancel={() => handleCancel('password')}
            />
        </div>
    );

    const renderAboutSection = () => (
        <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">אודות האפליקציה</h3>
                            <p className="text-white/80 text-sm">מידע טכני ופרטי מפתחים</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* App Info */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-slate-800">שם האפליקציה</h4>
                            </div>
                            <p className="text-blue-700 font-semibold">Finance Manager</p>
                            <p className="text-blue-600 text-sm mt-1">מערכת ניהול כספים משפחתית</p>
                        </div>

                        {/* Version */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v8a1 1 0 001 1h8a1 1 0 001-1V8m-7 4h6" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-slate-800">גרסה</h4>
                            </div>
                            <p className="text-green-700 font-semibold text-2xl">1.0.0</p>
                            <p className="text-green-600 text-sm mt-1">גרסה יציבה ראשונה</p>
                        </div>

                        {/* Developer */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-slate-800">צוות הפיתוח</h4>
                            </div>
                            <p className="text-purple-700 font-semibold">Finance Manager Team</p>
                            <p className="text-purple-600 text-sm mt-1">פיתוח ועיצוב מקצועי</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            תכונות עיקריות
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                'ניהול הוצאות חכם',
                                'מעקב תקציבים משפחתיים',
                                'ניתוח גרפי מתקדם',
                                'פרופילים מרובים להורים וילדים',
                                'ממשק משתמש אינטואיטיבי',
                                'אבטחת מידע מתקדמת'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-700 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNewProfileSection = () => (
        <CreateProfile username={account.username} onProfileCreated={updateProfile} />
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return renderProfileSection();
            case 'account':
                return renderAccountSection();
            case 'about':
                return renderAboutSection();
            case 'newProfile':
                return renderNewProfileSection();
            case 'addChildrenBudget':
                return <AddChildrenBudget />;
            default:
                return renderProfileSection();
        }
    };

    return (
        <>
            <PageLayout spacing={false}>
                {/* Professional Navigation */}
                <NavigationHeader 
                    title="הגדרות מערכת"
                    subtitle={`נהל את הפרופיל והחשבון - ${profile?.profileName || account?.username}`}
                />

                {/* Fixed Message Overlay */}
                <MessageBanner message={message} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
                    {/* Professional Header */}
                    <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800 mb-1">מרכז הגדרות</h1>
                                    <p className="text-slate-600">נהל את הפרופיל, החשבון וההעדפות האישיות שלך</p>
                                </div>
                            </div>
                            
                            <Button
                                onClick={() => navigate('/dashboard')}
                                style="primary"
                                size="auto"
                                className="flex items-center gap-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>חזור לדשבורד</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Professional Sidebar */}
                        <div className="xl:col-span-1">
                            <Sidebar sections={sections} activeSection={activeSection} onSelect={setActiveSection} />
                        </div>

                        {/* Main Content */}
                        <div className="xl:col-span-3">
                            <div className="space-y-6">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </PageLayout>
        </>
    );
}