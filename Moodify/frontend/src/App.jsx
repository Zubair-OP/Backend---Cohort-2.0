import { RouterProvider } from "react-router";
import { router } from "./features/App.routes";
import './features/shared/Style/global.css'
import { AuthProvider } from "./features/Auth/Auth.context.jsx";


function App() {

  return (
    <>
     <AuthProvider>
      <RouterProvider router={router} />
     </AuthProvider>
    </>
  )
}

export default App
