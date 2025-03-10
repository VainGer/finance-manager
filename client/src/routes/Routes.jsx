import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import Account from "../pages/Account"
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import AccountSettings from "../pages/AccountSettings";

export const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
    {
        path: '/register', element: <Register />
    },
    {
        path: '/account', element: <Account />
    },
    {
        path: '/dashboard', element: <Dashboard />
    },
    {
        path: '/acc_settings', element :<AccountSettings/>
    }
    
]);

export default router;