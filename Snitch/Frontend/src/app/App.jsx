import { Routes } from 'react-router'
import './App.css'
import { RouterProvider } from 'react-router'
import AppRoutes  from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from './features/auth/hook/useAuth'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  const {handleGetme} = useAuth();

  const user = useSelector((state) => state.auth.user)
  console.log(user)

  useEffect(() => {
    handleGetme()
  }, [])


  return (
    <>
        <RouterProvider router={AppRoutes} />
        <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
