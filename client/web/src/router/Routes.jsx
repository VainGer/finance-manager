import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ProfileAuth from "../pages/profile/ProfileAuth.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Settings from "../pages/Settings.jsx";
import UploadFromFileTransactions from "../pages/UploadFromFileTransactions.jsx";
import AdminHome from "../pages/admin/AdminHome.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminRegister from "../pages/admin/AdminRegister.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminLogs from "../pages/admin/AdminLogs.jsx";
import AdminProfiles from "../pages/admin/AdminProfiles.jsx";
import AdminExpenses from "../pages/admin/AdminExpenses.jsx";
import AdminBudgets from "../pages/admin/AdminBudgets.jsx";

const router = createBrowserRouter([
    {
        path: "/", element: <Home />,
    },
    {
        path: "/register", element: <Register />,
    },
    {
        path: "/login", element: <Login />,
    },
    {
        path: "/profiles", element: <ProfileAuth />,
    },
    {
        path: "/profile-auth", element: <ProfileAuth />,
    },
    {
        path: '/dashboard', element: <Dashboard />,
    },
    {
        path: '/settings', element: <Settings />,
    },
    {
        path: '/profile-settings', element: <Settings />,
    },
    {
        path: '/upload-from-file', element: <UploadFromFileTransactions />,
    },
    {
        path: '/admin', element: <AdminHome />,
    },
    {
        path: '/admin/login', element: <AdminLogin />,
    },
    {
        path: '/admin/register', element: <AdminRegister />,
    },
    {
        path: '/admin/dashboard', element: <AdminDashboard />,
    },
    {
        path: '/admin/logs', element: <AdminLogs />,
    },
    {
        path: '/admin/profiles', element: <AdminProfiles />,
    },
    {
        path: '/admin/expenses', element: <AdminExpenses />,
    },
    {
        path: '/admin/budgets', element: <AdminBudgets />,
    },

]);

export default router;
