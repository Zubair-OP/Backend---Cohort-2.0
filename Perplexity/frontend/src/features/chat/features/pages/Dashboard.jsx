import { useSelector } from "react-redux"
import { useChat } from "../hook/useChat"
import { useEffect } from "react"

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    console.log(user)

    const { InitializeSocket } = useChat()

    useEffect(() => {
        InitializeSocket()
    }, [])


  return (
    <div>
      <h1>Welcome</h1>
      <p>This is your dashboard.</p>
    </div>
  )
}

export default Dashboard
