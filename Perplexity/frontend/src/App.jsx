import AppRoutes from "./App.routes"
import { RouterProvider } from "react-router"
import AuthProvider from "./features/Auth/Authcontext"

function App() {

  return (
    <>
    <AuthProvider>
       <RouterProvider router={AppRoutes} />
    </AuthProvider>
    </>
  )
}

export default App
