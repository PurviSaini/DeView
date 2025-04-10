import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Resources.css';

const Resources = () => {
    return (
        <div>
            <Navbar title="Resource Sharing"/>
            <Sidebar />
            <div className="task-container p-3">
                <h3>Hi this is Resource Sharing page</h3>
            </div>
        </div>
    );
};

export default Resources