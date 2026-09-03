import './App.css'
import { RouterProvider } from 'react-router'
import AppRoutes  from './app.routes'
import { useEffect, useSyncExternalStore, lazy, Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { HelmetProvider } from 'react-helmet-async'
import { useAuth } from './features/auth/hook/useAuth'

const ChatWidget = lazy(() => import('./features/chat/components/ChatWidget'))

function App() {
  const { handleGetme } = useAuth();
  const pathname = useSyncExternalStore(
    AppRoutes.subscribe,
    () => AppRoutes.state.location.pathname,
    () => '/',
  );

  const hideChatRoutes = ['/login', '/register', '/checkout'];
  const shouldShowChat = !hideChatRoutes.includes(pathname);

  useEffect(() => {
    handleGetme();
  }, []);


  return (
    <HelmetProvider>
        <RouterProvider router={AppRoutes} />
        <ToastContainer position="top-right" autoClose={3000} />
        {shouldShowChat ? (
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
        ) : null}
    </HelmetProvider>
  )
}

export default App
