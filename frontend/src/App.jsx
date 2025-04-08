import { useState } from 'react'
import { useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Team from './pages/Team'
import Sidebar from './components/Sidebar'
import Task from './pages/Task'
import './App.css'
import axios from 'axios'

function App() {
  const [fruits, setFruits] = useState([]);
  
    useEffect(() => {
      axios.get(import.meta.env.VITE_BACKEND_URL+ "/api/fruits")
      .then((response) => {
        setFruits(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }, []);

  return (
    <>
    {/* <Login/> */}
    {/* <Team /> */}
    <Task/>
      {/* <h1> Hello this is frontend!! </h1>
        <p>Fruits: {fruits.length} </p>
      {
        fruits.map((fruit, index) => (
          <div key={fruit.id}>
            <h2>{fruit.title}</h2>
            <p>{fruit.content}</p>
          </div>
        ))    
      } */}
    </>
  )
}

export default App
