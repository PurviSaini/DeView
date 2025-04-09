import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Team from './pages/Team'
import Sidebar from './components/Sidebar'
import Task from './pages/Task'
import './App.css'

function App() {

  return (
    <>
    {/* <Login/> */}
    {/* <Register></Register> */}
    {/* <Team /> */}
    {/* <Task /> */}

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
