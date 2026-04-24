import {createBrowserRouter} from "react-router";
import Register from "./app/features/auth/pages/register";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>hello world</h1>,
    },
    {
        path: "/register",
        element: <Register />,
    }
]);