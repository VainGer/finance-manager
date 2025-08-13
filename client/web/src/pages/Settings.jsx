import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddChildrenBudget from '../components/profile/AddChildrenBudget';
import CreateProfile from '../components/profile/CreateProfile';
import useSettingsState from '../hooks/useSettingsState';
import Navbar from '../components/Navbar';
import Sidebar from '../components/settings/Sidebar';
import ProfileInfo from '../components/settings/ProfileInfo';
import PinChange from '../components/settings/PinChange';
import AvatarManager from '../components/settings/AvatarManager';
import DeleteProfile from '../components/settings/DeleteProfile';
import MessageBanner from '../components/settings/MessageBanner';
import PasswordChange from '../components/settings/PasswordChange';
import Button from '../components/common/Button';
import Footer from '../components/common/Footer';

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
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">פרטי חשבון</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם משתמש</label>
                        <div className="p-3 bg-gray-50 rounded border">
                            {account?.username || 'לא זמין'}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                        <div className="p-3 bg-gray-50 rounded border">
                            {account?.email || 'לא זמין'}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        onClick={handleLogout}
                        style="danger"
                        size="auto"
                    >
                        התנתק
                    </Button>
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
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">אודות האפליקציה</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-800">Finance Manager</h4>
                        <p className="text-sm text-gray-600">מערכת ניהול כספים משפחתית</p>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-800">גרסה</h4>
                        <p className="text-sm text-gray-600">1.0.0</p>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-800">מפתח</h4>
                        <p className="text-sm text-gray-600">צוות Finance Manager</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNewProfileSection = () => (
        <CreateProfile username={account.username} />
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
        <div className="min-h-screen bg-gray-100">
            {/* Add CSS for slideDown animation */}
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-100px) translateX(-50%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) translateX(-50%);
                    }
                }
            `}</style>

            <Navbar />

            {/* Fixed Message Overlay - Always visible */}
            <MessageBanner message={message} />

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ הגדרות</h1>
                        <p className="text-gray-600">נהל את החשבון והפרופיל שלך</p>
                    </div>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        style="primary"
                        size="auto"
                        className="flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>חזור לדשבורד</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar sections={sections} activeSection={activeSection} onSelect={setActiveSection} />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {renderContent()}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}