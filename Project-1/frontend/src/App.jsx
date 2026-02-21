import AppRoutes from "./AppRoutes"
import "./style.scss"
import AuthProvider from "./features/auth/auth.context"
function App() {

  return (
    <>
     <AuthProvider>
       <AppRoutes />
      </AuthProvider>
    </>
  )
}

export default App
