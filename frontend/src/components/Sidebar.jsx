import './Sidebar.css'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
    return (
        <div id="sidebar" className="col p-4">
            <NavLink to="/task" className="text-decoration-none sidebar-link row">Tasks</NavLink>
            <NavLink to="/ideator" className="text-decoration-none sidebar-link row">Ideator</NavLink>
            <NavLink to="/documentation" className="text-decoration-none sidebar-link row">Docs</NavLink>
            <NavLink to="/git-stats" className="text-decoration-none sidebar-link row">Stats</NavLink>
            <NavLink to="/resources" className="text-decoration-none sidebar-link row">Resources</NavLink>
            <NavLink to="/analytics" className="text-decoration-none sidebar-link row">Analytics</NavLink>
        </div>
    )
}