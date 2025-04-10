import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './GitStats.css';

const GitStats = () => {
    return (
        <div>
            <Navbar title="Github Stats"/>
            <Sidebar />
            <div className="task-container p-3">
                <h3>Hi this is Github Stats page</h3>
            </div>
        </div>
    );
};

export default GitStats