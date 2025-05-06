import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Team from './pages/Team';
import Ideator from './pages/Ideator';
import GitStats from './pages/gitStats';
import Resources from './pages/Resources';
import Analytics from './pages/Analytics';
import TeamProfile from './pages/TeamProfile';
import Sidebar from './components/Sidebar';
import Task from './pages/Task';
import './App.css';
import Documentation from './pages/Documentation';

const App = () => {
    return (
        <TaskProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/task" element={<Task />} />
                    <Route path="/ideator" element={<Ideator />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/git-stats" element={<GitStats />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/team-profile" element={<TeamProfile />} />
                </Routes>
        </TaskProvider>
    );
};

export default App;
