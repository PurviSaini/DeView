import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [fruits, setFruits] = useState([]);
  
    useEffect(()=>{
      axios.get("/api/fruits")
      .then((response)=>{
        setFruits(response.data)
    })
    .catch((error)=>{
      console.log(error)
    })
  })

  return (
    <>
      <h1> Hello this is frontend!! </h1>
      <p>Fruits: {fruits.length}</p>
      {
        fruits.map((fruit, index) => (
          <div key={fruit.id}>
            <h2>{fruit.title}</h2>
            <p>{fruit.content}</p>
          </div>
        ))    
      }
    </>
  )
}

export default App
