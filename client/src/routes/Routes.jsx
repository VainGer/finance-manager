import { createBrowserRouter } from "react-router-dom";

import Register from "../pages/Register";
import Account from "../pages/Account"
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

export const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
    {
        path: '/register', element: <Register />
    },
    {
        path: '/account', element: <Account />
    }, {
        path: '/dashboard', element: <Dashboard />
    }
]);

export default router;