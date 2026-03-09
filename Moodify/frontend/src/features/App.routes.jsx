import { createBrowserRouter } from "react-router";
import Login from "./Auth/pages/Login";
import Register from "./Auth/pages/Register";
import Protected from "./Auth/components/Protected";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><h1>Welcome to Home Page</h1></Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])