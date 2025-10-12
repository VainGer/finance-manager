import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileDataProvider } from './context/ProfileDataContext';
import Router from "./router/Routes.jsx";
import SplashScreen from './components/common/SplashScreen';

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
            <RouterProvider router={Router} />
          </ProfileDataProvider>
        </AuthProvider>
      )}
    </div>
  );
}