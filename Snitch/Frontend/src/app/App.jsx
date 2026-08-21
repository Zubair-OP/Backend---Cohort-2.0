import './App.css'
import { RouterProvider } from 'react-router'
import AppRoutes  from './app.routes'
import { useEffect, useSyncExternalStore } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { HelmetProvider } from 'react-helmet-async'
import ChatWidget from './features/chat/components/ChatWidget'
import { useAuth } from './features/auth/hook/useAuth'

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
        {shouldShowChat ? <ChatWidget /> : null}
    </HelmetProvider>
  )
}

export default App
