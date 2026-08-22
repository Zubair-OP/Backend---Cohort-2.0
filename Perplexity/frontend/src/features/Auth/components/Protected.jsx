import { useSelector } from "react-redux"
import { Navigate } from "react-router"

const LoadingSkeleton = () => (
  <div className="flex h-screen w-screen bg-surface-0 items-center justify-center">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="w-10 h-10 rounded-xl bg-surface-3 border border-border flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-accent/30 animate-pulse-soft" />
      </div>
      <div className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-accent animate-typing-dot"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
)

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export default Protected
