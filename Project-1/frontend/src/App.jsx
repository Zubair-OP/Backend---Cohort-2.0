import AppRoutes from "./AppRoutes"
import "./style.scss"
import AuthProvider from "./features/auth/auth.context"
// import PostProvider from "./features/post/postcontext"


function App() {

  return (
    <>
     {/* <PostProvider> */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    {/* </PostProvider> */}
    </>
  )
}

export default App
