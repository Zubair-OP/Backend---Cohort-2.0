import axios from 'axios'
import { useEffect,useState } from 'react'
function App() {
  
  

  const [data, setData] = useState(null)

  useEffect(()=>{
    axios.get('/api/data')
    .then(res=>setData(res.data))
    .catch(err=>console.log(err))
  },[])


  return (
    <>
      <h1>Docker Frontend</h1>
      {data && <p>{data.message}</p>}
    </>
  )
}

export default App
