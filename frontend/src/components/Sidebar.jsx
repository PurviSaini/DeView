import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTasks, FaLightbulb, FaFileAlt, FaChartBar, FaTools, FaChartLine, FaBars } from "react-icons/fa"; // example icons
import "bootstrap/dist/css/bootstrap.min.css";
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true";
  });

  const toggleSidebar = () => {
    setCollapsed(prev => {
        localStorage.setItem("sidebar-collapsed", !prev);
        return !prev;
      });
  };

  return (
    <div id="sidebar" className={`p-2 ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars size={18} className="ms-2" />
      </div>
      <NavLink to="/task" className="sidebar-link">
        <FaTasks className="me-2" size={18} />{!collapsed && "Tasks"}
      </NavLink>
      <NavLink to="/ideator" className="sidebar-link">
        <FaLightbulb className="me-2" size={18} />
        {!collapsed && "Ideator"}
      </NavLink>
      <NavLink to="/documentation" className="sidebar-link">
        <FaFileAlt className="me-2" size={18} />
        {!collapsed && "Docs"}
      </NavLink>
      <NavLink to="/git-stats" className="sidebar-link">
        <FaChartBar className="me-2" size={18} />
        {!collapsed && "Stats"}
      </NavLink>
      <NavLink to="/resources" className="sidebar-link">
        <FaTools className="me-2" size={18} />
        {!collapsed && "Resources"}
      </NavLink>
      <NavLink to="/analytics" className="sidebar-link">
        <FaChartLine className="me-2" size={18} />
        {!collapsed && "Analytics"}
      </NavLink>
    </div>
  );
}

export default Sidebar;
