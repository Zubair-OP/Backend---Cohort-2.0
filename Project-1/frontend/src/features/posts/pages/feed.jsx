import '../style/feed.scss'
import Posts from '../components/posts'
import { useAuth } from '../hooks/usePost'
import { useEffect } from 'react'

const Feed = () => {
  const {handleFeed , feed, loading} = useAuth()

  useEffect(() => {
    handleFeed()
  }, [])

  if(loading || !feed) {
    return <p>Loading...</p>
  }
  return (
    <main className='feed-page' >
            <div className="feed">
                <div className="posts">
                    {feed.map(post=>{
                        return <Posts key={post._id} user={post.user} post={post} loading={loading}/>
                    })}
                </div>
            </div>
        </main>
  )
}

export default Feed
