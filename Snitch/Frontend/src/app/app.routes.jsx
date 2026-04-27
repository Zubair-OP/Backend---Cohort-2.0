import { createBrowserRouter } from 'react-router';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/product/pages/Home';
import Dashboard from './features/product/pages/Dashboard';
import Protected from './components/Protected';
import CreateProduct from './features/product/pages/CreateProduct';

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
    element: <Protected role="seller"><Dashboard /></Protected>
  },
  {
    path:'/create-product',
    element: <Protected role="seller"><CreateProduct /></Protected>
  }
])

export default AppRoutes;