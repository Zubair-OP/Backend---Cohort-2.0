import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css'

function App() {

  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get('/api/data')
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Data from Backend:</h1>
      {data ? (
        <div>
          <p>{data.message}</p>
          <small>{new Date(data.timestamp).toLocaleString()}</small>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default App
