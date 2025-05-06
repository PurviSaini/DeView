import React, { useState,useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { SidebarContext } from '../context/SidebarContext';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Analytics.css';

const Analytics = () => {
    const { tasks } = useContext(TaskContext);
    const { isCollapsed } = useContext(SidebarContext);
  const [selectedMember, setSelectedMember] = useState("All");
    // Get unique team members from tasks
    const teamMembers = [...new Set(tasks.map((task) => task.assignedTo))];

    return (
        <div>
            <Navbar title="Analytics Dashboard" />
            <Sidebar />
            <div className={`analytics-container ${isCollapsed ? "collapsed" : ""}`}>
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

                {/* Personal Tasks */}
                <div className="chart-container personal-tasks">
                    <h3>Personal Tasks</h3>
                    <label htmlFor="member-select">Select Member: </label>
                    <select
                        id="member-select"
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                    >
                        <option value="All">All</option>
                        {Object.keys(
                            tasks.reduce((acc, task) => {
                                acc[task.assignedTo] = true;
                                return acc;
                            }, {})
                        ).map((member) => (
                            <option key={member} value={member}>
                                {member}
                            </option>
                        ))}
                    </select>
                    <BarChart
                        width={800}
                        height={300}
                        data={Object.entries(
                            tasks.reduce((acc, task) => {
                                if (!acc[task.assignedTo]) {
                                    acc[task.assignedTo] = { name: task.assignedTo, "to do": 0, completed: 0, "in progress": 0 };
                                }
                                acc[task.assignedTo]["to do"] += 1;
                                if (task.status === "completed") {
                                    acc[task.assignedTo].completed += 1;
                                } else if (task.status === "in progress") {
                                    acc[task.assignedTo]["in progress" ]+= 1;
                                }
                                return acc;
                            }, {})
                        )
                            .map(([_, value]) => value)
                            .filter((data) => selectedMember == "All" || data.name == selectedMember)}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name, props) => {
                                const taskNames = tasks 
                                    .filter(task => task.assignedTo === props.payload.name && task.status == name)
                                    .map(task => task.title)
                                    .join(` 🛑 `);
                                return [`${taskNames} `, `${name} `];
                            }}
                        />
                        <Legend />
                        <Bar dataKey="to do" fill="#1844d8" />
                        <Bar dataKey="completed" fill="#00ca9f" />
                        <Bar dataKey="in progress" fill="#ffc658" />
                    </BarChart>
                </div>
                {/* Contribution Bar Chart */}
                <div className="chart-container bar-chart">
                    <h3>Contribution</h3>
                    <BarChart width={400} height={300} data={Object.entries(
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
                        <Bar dataKey="Assigned" fill="#FF6384" />
                        <Bar dataKey="Completed" fill="#36A2EB" />
                    </BarChart>
                </div>


            </div>
        </div>
    );
};

export default Analytics;