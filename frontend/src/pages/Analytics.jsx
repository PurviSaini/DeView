import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Analytics.css';

const Analytics = () => {
    return (
        <div>
            <Navbar title="Analytics Dashboard"/>
            <Sidebar />
            <div className="task-container p-3">
                <h3>Hi this is Analytics Dashboard</h3>
            </div>
        </div>
    );
};

export default Analytics