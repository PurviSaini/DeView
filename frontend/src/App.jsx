import { useState } from 'react'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Team from './pages/team'
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
    {/* <Register></Register> */}
    {/* <Team /> */}
    {/* <Task /> */}
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

      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/team' element={<Team />}/>
        <Route path='/task' element={<Task />}/>
      </Routes>
    </>
  )
}

export default App
