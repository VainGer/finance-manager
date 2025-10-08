import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileDataProvider } from './context/ProfileDataContext';
import Router from "./router/Routes.jsx";

export default function App() {
  return (
    <div dir="rtl">
      <AuthProvider>
        <ProfileDataProvider>
          <RouterProvider router={Router} />
        </ProfileDataProvider>
      </AuthProvider>
    </div>
  );
}