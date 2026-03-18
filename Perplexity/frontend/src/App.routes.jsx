import { createBrowserRouter } from 'react-router';
import Login from './features/Auth/pages/login';
import Register from './features/Auth/pages/register';


const AppRoutes = createBrowserRouter([
  {
    path: '/',
    element: <h1>Welcome to the App</h1>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])

export default AppRoutes;