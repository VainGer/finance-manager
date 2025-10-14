import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import Router from "./router/Routes.jsx";
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileDataProvider, useProfileData } from './context/ProfileDataContext';
import SplashScreen from './components/common/SplashScreen';
import CenteredModal from './components/common/CenteredModal.jsx';
import Button from './components/common/Button';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div dir="rtl">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <AuthProvider>
          <ProfileDataProvider>
            <AuthGate>
              <RouterProvider router={Router} />
            </AuthGate>
          </ProfileDataProvider>
        </AuthProvider>
      )}
    </div>
  );
}


function AuthGate({ children }) {
  const { isExpiredToken } = useAuth();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    if (isExpiredToken) {
      setShowSessionExpired(true);
    }
  }, [isExpiredToken]);




  return (
    <>
      {showSessionExpired && (
        <CenteredModal>
          <div className="text-center text-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <p className='mb-4'>
              הסשן שלך פג תוקף<br />
              אנא התחבר מחדש כדי להמשיך לשימוש באתר.
            </p>
            <Button
              onClick={() => {
                window.location.href = '/login';
                setShowSessionExpired(false);
              }}
            >
              התחברות מחדש
            </Button>
          </div>
        </CenteredModal>
      )}

      {children}
    </>
  );
}
