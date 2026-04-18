import { createBrowserRouter } from 'react-router';
import Login from './features/Auth/pages/login';
import Register from './features/Auth/pages/register';
import Dashboard from './features/chat/features/pages/Dashboard';
import Protected from './features/Auth/components/Protected';


const AppRoutes = createBrowserRouter([
  {
    path: '/',
    element: <Protected>
      <Dashboard />
    </Protected>
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
