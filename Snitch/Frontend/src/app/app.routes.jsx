import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import Home from './features/product/pages/Home';
import Protected from './components/Protected';

const Register = lazy(() => import('./features/auth/pages/register'));
const Login = lazy(() => import('./features/auth/pages/Login'));
const Dashboard = lazy(() => import('./features/product/pages/Dashboard'));
const CreateProduct = lazy(() => import('./features/product/pages/CreateProduct'));
const ProductDetails = lazy(() => import('./features/product/pages/ProductDetails'));
const SellerproductDetails = lazy(() => import('./features/product/pages/SellerproductDetails'));
const Cart = lazy(() => import('./features/cart/pages/Cart'));
const Checkout = lazy(() => import('./features/payment/pages/Checkout'));
const PaymentSuccess = lazy(() => import('./features/payment/pages/PaymentSuccess'));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-cream">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

const AppRoutes = createBrowserRouter([
  {
    path: '/register',
    element: withSuspense(Register)
  },
  {
    path: '/login',
    element: withSuspense(Login)
  },
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/Dashboard',
    element: <Protected role="seller">{withSuspense(Dashboard)}</Protected>
  },
  {
    path:'/create-product',
    element: <Protected role="seller">{withSuspense(CreateProduct)}</Protected>
  },
  {
    path: '/product/:id',
    element: withSuspense(ProductDetails)
  },
  {
    path: '/seller-product/:Productid',
    element: <Protected role="seller">{withSuspense(SellerproductDetails)}</Protected>
  },
  {
    path: '/cart',
    element: withSuspense(Cart)
  },
  {
    path: '/checkout',
    element: withSuspense(Checkout)
  },
  {
    path: '/payment-success',
    element: withSuspense(PaymentSuccess)
  }
]);

export default AppRoutes;