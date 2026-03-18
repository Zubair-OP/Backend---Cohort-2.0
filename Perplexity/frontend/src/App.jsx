import AppRoutes from "./App.routes"
import { RouterProvider } from "react-router"
import { useAuth } from "./features/Auth/hooks/useAuth"
import { useEffect } from "react"

function App() {

  const { fetchCurrentUser } = useAuth()

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
       <RouterProvider router={AppRoutes} />
  )
}

export default App
