import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './routes/Routes.jsx';

export default function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}