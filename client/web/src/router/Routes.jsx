import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ProfileAuth from "../pages/profile/ProfileAuth.jsx";
import Dashboard from "../pages/Dashboard.jsx";

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
        path: '/dashboard', element: <Dashboard />,
    }
]);

export default router;
