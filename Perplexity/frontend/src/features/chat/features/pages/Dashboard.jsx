import { useSelector } from "react-redux"

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth)
    console.log(user)
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is your dashboard.</p>
    </div>
  )
}

export default Dashboard
