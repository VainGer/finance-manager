import { createBrowserRouter } from "react-router-dom";

import Home from "../../src_old/pages/Home";
// import Account from "../../src_old/pages/Account";
// import Dashboard from "../../src_old/pages/Dashboard";
// import AccountSettings from "../../src_old/pages/AccountSettings";

export const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
    {
        path: '/account', element: <Account />
    },
    {
        path: '/dashboard', element: <Dashboard />
    },
    {
        path: '/acc_settings', element: <AccountSettings />
    }

]);

export default router;