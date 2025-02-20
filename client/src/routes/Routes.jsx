import { createBrowserRouter } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../pages/Account"
import Home from "../pages/Home";

export const router = createBrowserRouter([
    {
        path: '/', element: <Home />
    },
    {
        path: '/login', element: <Login />
    },
    {
        path: '/register', element: <Register />
    },
    {
        path: '/account', element: <Account />
    }
]);

export default router;