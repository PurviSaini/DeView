import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import './Task.css'

export default function Task(){
    return (
        <div>
            <Navbar/>
            <Sidebar/>

            <div className="task-container">
                <ul>
                    Task List 
                    <li>To Do</li>
                    <li>In Progress</li>
                    <li>Completed</li>
                </ul>
            </div>
        </div>
    )
}