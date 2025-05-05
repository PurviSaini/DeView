import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Analytics.css';

const Analytics = () => {
    const { tasks } = useContext(TaskContext);

    // Get unique team members from tasks
    const teamMembers = [...new Set(tasks.map((task) => task.assignedTo))];

    return (
        <div>
            <Navbar title="Analytics Dashboard" />
            <Sidebar />
            <div className="analytics-container">
                {/* Task Allocation Pie Chart */}
                <div className="chart-container pie-chart">
                    <h3>Task Allocation</h3>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={Object.entries(
                                tasks.reduce((acc, task) => {
                                    acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
                                    return acc;
                                }, {})
                            ).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {teamMembers.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                {/* Heatmap Placeholder */}
                <div className="chart-container heatmap">
                    <h3>Heatmap</h3>
                    <div className="heatmap-placeholder">Heatmap Placeholder</div>
                </div>

                {/* Contribution Bar Chart */}
                <div className="chart-container bar-chart">
                    <h3>Contribution</h3>
                    <BarChart width={800} height={300} data={Object.entries(
                        tasks.reduce((acc, task) => {
                            acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
                            return acc;
                        }, {})
                    ).map(([name, value]) => ({ name, Assigned: value, Completed: Math.floor(value / 2) }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Assigned" fill="#8884d8" />
                        <Bar dataKey="Completed" fill="#82ca9d" />
                    </BarChart>
                </div>

                {/* Personal Tasks Placeholder */}
                <div className="chart-container personal-tasks">
                    <h3>Personal Tasks</h3>
                    <div className="personal-tasks-placeholder">Personal Tasks Placeholder</div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;