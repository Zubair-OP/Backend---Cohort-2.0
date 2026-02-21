import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<h1>Welcome to the Home Page</h1>} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
