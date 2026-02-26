import AppRoutes from "./AppRoutes"
import "./style.scss"
import AuthProvider from "./features/auth/auth.context"
import { PostProvider } from "./features/posts/Post.context"


function App() {

  return (
    <>     
      <AuthProvider>
        <PostProvider>
          <AppRoutes />
        </PostProvider>
      </AuthProvider>
    </>
  )
}

export default App
