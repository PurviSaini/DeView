import './Sidebar.css'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
    return (
        <div id="sidebar" className="col p-4">
            <NavLink to="/task" className="text-decoration-none sidebar-link row">Tasks</NavLink>
            <a href='/' className="row">Ideator</a>
            <a href='/' className="row">Docs</a>
            <a href='/' className="row">Stats</a>
            <a href='/' className="row">Resources</a>
        </div>
    )
}