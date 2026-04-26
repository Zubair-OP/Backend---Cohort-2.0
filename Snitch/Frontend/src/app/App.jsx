import { Routes } from 'react-router'
import { RouterProvider } from "react-router"
import AppRoutes from "./app.routes.jsx"
import './App.css'

function App() {
  return (
    <>
        <RouterProvider router={AppRoutes} />

    </>
  )
}

export default App
