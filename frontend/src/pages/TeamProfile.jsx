import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './TeamProfile.css';

const TeamProfile = () => {
    return (
        <div>
            <Navbar title="Team Profile"/>
            <Sidebar />
            <div className="task-container p-3">
                <h3>Hi this is Team Profile page</h3>
            </div>
        </div>
    );
};

export default TeamProfile