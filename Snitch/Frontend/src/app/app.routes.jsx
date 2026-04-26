import { createBrowserRouter } from 'react-router';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/product/pages/Home';
import Dashboard from './features/product/pages/Dashboard';

const AppRoutes = createBrowserRouter([
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/Dashboard',
    element: <Dashboard />
  }
])

export default AppRoutes;