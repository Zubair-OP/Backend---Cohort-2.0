import { useAuth } from "../hooks/usePost";
import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../style/post.scss'



const createPost = () => {
  const { handleCreatePost, loading } = useAuth()

  const [caption, setcaption] = useState()
  const Imageref = useRef()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault()
    const file = Imageref.current.files[0]
    await handleCreatePost(file, caption)
    navigate('/')
  }


  if (loading) {
    return <main>Loading...</main>
  }

  return (
    <main>
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}>
          <label className="post-image-label" htmlFor="imgUrl">Upload Image</label>
          <input type="file" ref={Imageref} hidden accept="image/*" name='imgUrl' className='img' id='imgUrl' />
          <input type="text" onChange={(e) => setcaption(e.target.value)} name='caption' id='caption' placeholder='Enter Caption' />
          <button>Post</button>
        </form>
      </div>
    </main>
  )
}

export default createPost