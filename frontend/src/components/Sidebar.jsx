import { useState } from "react";
import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import { NavLink } from "react-router-dom";
import { FaTasks, FaLightbulb, FaFileAlt, FaChartBar, FaTools, FaChartLine, FaBars } from "react-icons/fa"; // example icons
import "bootstrap/dist/css/bootstrap.min.css";
import './Sidebar.css';

const Sidebar = () => {
  const {isCollapsed, setIsCollapsed} = useContext(SidebarContext);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  return (
    <div id="sidebar" className={`p-2 ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars size={18} className="ms-2" />
      </div>
      <NavLink to="/task" className="sidebar-link">
        <FaTasks className="me-2" size={18} />{!isCollapsed && "Tasks"}
      </NavLink>
      <NavLink to="/ideator" className="sidebar-link">
        <FaLightbulb className="me-2" size={18} />
        {!isCollapsed && "Ideator"}
      </NavLink>
      <NavLink to="/documentation" className="sidebar-link">
        <FaFileAlt className="me-2" size={18} />
        {!isCollapsed && "Docs"}
      </NavLink>
      <NavLink to="/git-stats" className="sidebar-link">
        <FaChartBar className="me-2" size={18} />
        {!isCollapsed && "Stats"}
      </NavLink>
      <NavLink to="/resources" className="sidebar-link">
        <FaTools className="me-2" size={18} />
        {!isCollapsed && "Resources"}
      </NavLink>
      <NavLink to="/analytics" className="sidebar-link">
        <FaChartLine className="me-2" size={18} />
        {!isCollapsed && "Analytics"}
      </NavLink>
    </div>
  );
}

export default Sidebar;
