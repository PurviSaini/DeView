import React, { useState, useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import { SidebarContext } from "../context/SidebarContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import Navbar from "../components/Navbar";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./Analytics.css";
import { Placeholder } from "react-bootstrap";

const Analytics = () => {
  const { tasks } = useContext(TaskContext);
  const { isCollapsed } = useContext(SidebarContext);
  const [selectedMember, setSelectedMember] = useState("All");

  // Get unique team members from tasks
  const teamMembers = [...new Set(tasks.map((task) => task.assignedTo))];
  const [heatmapData, setHeatmapData] = useState([]);

  // Fetch commit data from the backend
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // Fetch commit data from the backend
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/commits",
          { withCredentials: true }
        );
        const commits = response.data;
        console.log("Fetched commit data:", commits);
        // Process commit data for the heatmap
        // const processedData
        setHeatmapData(commits);
      } catch (error) {
        console.error("Error fetching commit data:", error);
      }
    };

    fetchAndProcessData();
  }, []);

  const uniqueAuthors = [...new Set(heatmapData.map((d) => d.author))];
  console.log(uniqueAuthors);

  const totalCommitsByContributor = heatmapData.reduce((acc, curr) => {
    acc[curr.author] = (acc[curr.author] || 0) + curr.count;
    return acc;
  }, {});

  const getColor = (count) => {
    if (count === 0) return "#ffe6eb";
    if (count <= 2) return "#ffb3bf";
    if (count <= 5) return "#ff6680";
    if (count <= 10) return "#c94255";
    return "#8b2036";
  };

  return (
    <div>
      <Navbar title="Analytics Dashboard" />
      <Sidebar />
      <div className={`analytics-container ${isCollapsed ? "collapsed" : ""}`}>
        {/* Task Allocation Pie Chart */}
        <div className="chart-container pie-chart">
          <h3>Task Allocation</h3>
          <PieChart width={300} height={300}>
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
                <Cell
                  key={`cell-${index}`}
                  fill={["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"][index % 4]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Heatmap Placeholder */}
        <div className="chart-container heatmap">
          <h3 className="mb-3">Commit Heatmap</h3>

          {heatmapData.length === 0 ? (
            <Placeholder as="div" animation="glow">
              <Placeholder
                xs={12}
                style={{ height: "200px", width: "100%" }}
              />
            </Placeholder>
          ) : (
            <>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
                width={800}
                height={200}
              >
                <XAxis
                  type="number"
                  dataKey="hour"
                  name="Hour"
                  domain={[0, 23]}
                  tickCount={24}
                  label={{
                    value: "Hours of Day",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="author"
                  name="contributor"
                  allowDuplicatedCategory={false}
                  label={{ value: "", angle: -90, position: "insideLeft" }}
                />
                <ZAxis type="number" dataKey="count" range={[10, 60]} />
                <Tooltip />
                <Scatter
                  data={heatmapData}
                  shape={(props) => (
                    <rect
                      x={props.cx}
                      y={props.cy - 10}
                      width={20}
                      height={20}
                      fill={getColor(props.payload.count)}
                      stroke="#ccc"
                      strokeWidth={0.5}
                      rx={2}
                    />
                  )}
                />
              </ScatterChart>
              <div style={{ marginTop: "20px" }}>
                <ul className="list-unstyled">
                  {Object.entries(totalCommitsByContributor).map(
                    ([author, count]) => (
                      <li key={author}>
                        <strong>{author}:</strong> {count} commits
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Contribution Bar Chart */}
        <div className="chart-container bar-chart">
          <h3>Contribution</h3>
          <BarChart
            width={500}
            height={300}
            data={Object.entries(
              tasks.reduce((acc, task) => {
                if (!acc[task.assignedTo]) {
                  acc[task.assignedTo] = {
                    name: task.assignedTo,
                    Assigned: 0,
                    Completed: 0,
                  };
                }
                if (task.status === "to do" || task.status === "in progress") {
                  acc[task.assignedTo].Assigned += 1;
                }
                if (task.status === "completed") {
                  acc[task.assignedTo].Completed += 1;
                }
                return acc;
              }, {})
            ).map(([_, value]) => value)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Assigned" fill="#FF6384" name="Assigned Tasks" />
            <Bar dataKey="Completed" fill="#36A2EB" name="Completed Tasks" />
          </BarChart>
        </div>
        <div className="chart-container personal-tasks">
          <h3>Personal Tasks</h3>
          <BarChart
            width={300}
            height={300}
            data={Object.entries(
              tasks.reduce((acc, task) => {
                if (!acc[task.assignedTo]) {
                  acc[task.assignedTo] = {
                    name: task.assignedTo,
                    "to do": 0,
                    completed: 0,
                    "in progress": 0,
                  };
                }
                acc[task.assignedTo]["to do"] += 1;
                if (task.status === "completed") {
                  acc[task.assignedTo].completed += 1;
                } else if (task.status === "in progress") {
                  acc[task.assignedTo]["in progress"] += 1;
                }
                return acc;
              }, {})
            )
              .map(([_, value]) => value)
              .filter((data) => data.name === localStorage.getItem("username"))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => {
                const taskNames = tasks
                  .filter(
                    (task) =>
                      task.assignedTo === props.payload.name &&
                      task.status === name
                  )
                  .map((task) => task.title)
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
      </div>
    </div>
  );
};

export default Analytics;
