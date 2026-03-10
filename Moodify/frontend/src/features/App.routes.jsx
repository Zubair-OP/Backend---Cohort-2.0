import { createBrowserRouter } from "react-router";
import Login from "./Auth/pages/Login";
import Register from "./Auth/pages/Register";
import Protected from "./Auth/components/Protected";
import FaceDetectorComponent from "./Exprsession/pages/FaceEmotion";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><FaceDetectorComponent /></Protected>
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