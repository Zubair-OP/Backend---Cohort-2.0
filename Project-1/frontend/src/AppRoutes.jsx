import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'
import Feed from './features/posts/pages/feed.jsx'
import CreatePost from './features/posts/components/createPost.jsx'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<Feed />} />
                <Route path='/createPost' element={<CreatePost />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
