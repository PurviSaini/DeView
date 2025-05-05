import React, { useContext,useState,useEffect, useRef } from "react";
import { TaskContext } from '../context/TaskContext';
import axios from 'axios';
import { Form, Button, Card, Row, Col, Table, Modal, Dropdown, Badge } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import './Task.css'

export default function Task(){
    const { tasks, setTasks } = useContext(TaskContext);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const [filters, setFilters] = useState({
        priority: [],
        assignedTo: [],
        status: [],
      });
    const [sortOption, setSortOption] = useState("");
    const filterDropdownRef = useRef();
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
        try {
          const res = await axios.get(import.meta.env.VITE_BACKEND_URL+ "/tasks", {
            withCredentials: true,
          });
          setTasks(res.data.tasks || []);
        } catch (err) {
          console.error("Failed to fetch tasks", err);
        }
      };
    const fetchTeamMembers = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL+ "/team", {
          withCredentials: true, 
        });
        setTeamMembers(res.data.members || []);
      } catch (err) {
        console.error("Failed to fetch team members", err);
      }
    };

    fetchTeamMembers();
    fetchTasks();
  }, [setTasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Load filters from localStorage
    const savedFilters = localStorage.getItem("taskFilters");
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }

    // Load sort option from localStorage
    const savedSortOption = localStorage.getItem("taskSortOption");
    if (savedSortOption) {
      setSortOption(savedSortOption);
    }
  }, []);

  const handleShowDetails = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setShowModal(false);
    };

    const [formData, setFormData] = useState({
        title: "",
        dueDate: "",
        assignedTo: "",
        priority: "",
        desc: "",
    });

    const priorityOptions = ["low", "med", "high"];
    const statusOptions =  ["to do", "in progress", "completed"];

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = {
            ...formData,
        };
        console.log(newTask);
        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/tasks", newTask,{
                withCredentials: true,
              });

            setTasks((prev) => [...prev, res.data.task || newTask]);
            setFormData({
                title:"",
                dueDate:"",
                assignedTo:"",
                priority:"",
                desc:"",
            });
            alert("Task added successfully!");
        } catch (err) {
            alert("Failed to add task");
            console.error(err);
        }
    };

    const handleTaskChange = async (index, field, value) => {
        const taskToUpdate = displayedTasks[index];
        const taskId = taskToUpdate._id;

        const updatedTasks = tasks.map((task) =>
            task._id === taskId ? { ...task, [field]: value } : task
        );
        setTasks(updatedTasks);

        try {
            await axios.patch(
                import.meta.env.VITE_BACKEND_URL+ "/tasks" + `/${taskId}`,
                { [field]: value },{
                    withCredentials: true,
                  }
            );
            // console.log(`Task ${taskId} field '${field}' updated to '${value}'`);
        } catch (err) {
            alert("Failed to update task field");
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if(confirm("Are you sure you want to delete this task?")){
            try {
            await axios.delete(import.meta.env.VITE_BACKEND_URL+ "/tasks" + `/${taskId}`,{
                withCredentials: true,
            });
            const updatedTasks = tasks.filter((task) => task._id !== taskId);
            setTasks(updatedTasks);
            } catch (err) {
            console.error("Failed to delete task", err);
            alert("Error deleting task");
            }
        }
    };

  const toggleFilter = (type, value) => {
    const updatedFilters = {
      ...filters,
      [type]: filters[type].includes(value)
        ? filters[type].filter((v) => v !== value)
        : [...filters[type], value],
    };
    setFilters(updatedFilters);

    // Save filters to localStorage
    localStorage.setItem("taskFilters", JSON.stringify(updatedFilters));
  };

  const clearFilters = () => {
    const clearedFilters = { priority: [], assignedTo: [], status: [] };
    setFilters(clearedFilters);

    // Save cleared filters to localStorage
    localStorage.setItem("taskFilters", JSON.stringify(clearedFilters));
  };

  const handleSortChange = (e) => {
    const selectedSortOption = e.target.value;
    setSortOption(selectedSortOption);

    // Save sort option to localStorage
    localStorage.setItem("taskSortOption", selectedSortOption);
  };

    let displayedTasks = [...tasks];

    // Filtering
    if (filters.priority.length)
        displayedTasks = displayedTasks.filter(t => filters.priority.includes(t.priority));
    if (filters.assignedTo.length)
        displayedTasks = displayedTasks.filter(t => filters.assignedTo.includes(t.assignedTo));
    if (filters.status.length)
        displayedTasks = displayedTasks.filter(t => filters.status.includes(t.status));

    // Sorting
    if (sortOption === "priorityLowHigh") {
        displayedTasks.sort((a, b) =>
            priorityOptions.indexOf(a.priority) - priorityOptions.indexOf(b.priority)
        );
    } else if (sortOption === "priorityHighLow") {
        displayedTasks.sort((a, b) =>
            priorityOptions.indexOf(b.priority) - priorityOptions.indexOf(a.priority)
        );
    } else if (sortOption === "dueDateRecent") {
        displayedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    const getUserColor = (username) => {
        const colors = ['#e73cbf', '#a812f3', '#3498db', '#1abc9c'];
        const index = teamMembers.indexOf(username);
        return colors[index % colors.length]; // wrap around if more users
    };  
    
    const getStatusColor = (status) => {
        const statusColors = ["#0d6efd", "#fd7e14","#20c997"];
        const index = statusOptions.indexOf(status);
        return statusColors[index % statusColors.length] || "#6c757d"; // fallback gray
    };
      
    
    const getPriorityVariant = (priority) => {
        switch (priority) {
          case "high":
            return "danger";
          case "med":
            return "warning";
          case "low":
            return "success";
          default:
            return "secondary";
        }
    };

    return (
        <div>
            <Navbar title="Tasks"/>
            <Sidebar/>
            <div className="task-container">
                {/* Task Form */}
                <Card className="p-4 m-5 form-bg-gradient text-light border-violet shadow-none" >
                    <h4 className="fw-bold mb-3">Add new Task:</h4>
                    <Form className="m-0 p-3 border-0 shadow-none" onSubmit={handleSubmit}>
                        <Row className="mb-3 no-bg">
                            <Col md={4}  className="no-bg">
                                <Form.Group className="no-bg">
                                    <Form.Label>Title:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        className="dark-input"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} className="no-bg">
                                <Form.Group className="no-bg">
                                    <Form.Label className="no-bg">Due Date:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dueDate"
                                        className="dark-input"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} className="no-bg">
                                <Form.Group className="no-bg">
                                    <Form.Label className="no-bg">Assigned to:</Form.Label>
                                    <Form.Select
                                        name="assignedTo"
                                        className="dark-input"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select member</option>
                                        {teamMembers.map((member, i) => (
                                            <option key={i} value={member}>
                                            {member}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3 no-bg">
                            <Col md={4} className="no-bg">
                                <Form.Group className="no-bg">
                                    <Form.Label>Priority:</Form.Label>
                                    <Form.Select
                                        name="priority"
                                        className="dark-input"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select priority</option>
                                        {priorityOptions.map((opt, i) => (
                                            <option key={i} value={opt}>
                                            {opt}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={8} className="no-bg">
                                <Form.Group className="no-bg">
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="desc"
                                        className="dark-input"
                                        value={formData.desc}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-center no-bg">
                            <Button variant="dark" type="submit" className="rounded-pill px-4">
                                Add Task
                            </Button>
                        </div>
                    </Form>
                </Card>

                {/* Task Table */}
                <Card className="m-5 p-4 shadow table-bg-gradient">
                    <h4 className="fw-bold text-center no-bg">Task List</h4>
                    <div className="d-flex justify-content-between align-items-center px-2">
                        <div className="d-flex align-items-center flex-wrap gap-2" ref={filterDropdownRef}>
                            <Button variant="outline-light btn-dark" onClick={() => setShowFilterDropdown(prev => !prev)}>
                                Filter Tasks
                            </Button>
                            <div className="d-flex flex-wrap gap-2 ms-2">
                                {/* Priority filters */}
                                {filters.priority.map((p, i) => (
                                    <Badge key={`p-${i}`} bg={getPriorityVariant(p)} className="px-2 py-1">
                                        {p}
                                    </Badge>
                                ))}

                                {/* Assigned To filters */}
                                {filters.assignedTo.map((name, i) => (
                                    <Badge
                                        key={`a-${i}`}
                                        bg="dark"
                                        className="px-2 py-1"
                                        style={{
                                            color: getUserColor(name),
                                            fontWeight: "bold",
                                            backgroundColor: "#343a40", // dark background
                                        }}
                                    >
                                        {name}
                                    </Badge>
                                ))}

                                {/* Status filters */}
                                {filters.status.map((s, i) => (
                                    <Badge
                                        key={`s-${i}`}
                                        bg="dark"
                                        className="px-2 py-1"
                                        style={{
                                            color: getStatusColor(s),
                                            fontWeight: "bold",
                                            backgroundColor: "#343a40",
                                        }}
                                    >
                                        {s}
                                    </Badge>
                                ))}
                            </div>
                            {showFilterDropdown && (
                                <div className="position-absolute bg-dark text-white p-3 rounded shadow" style={{ zIndex: 10, minWidth: 220 }}>
                                    <strong>Priority</strong>
                                    {priorityOptions.map((p, i) => (
                                        <Form.Check key={i} type="checkbox" className="no-border-checkbox m-1" label={p} checked={filters.priority.includes(p)} onChange={() => toggleFilter("priority", p)} />
                                    ))}
                                    <hr />
                                    <strong>Assigned To</strong>
                                    {teamMembers.map((m, i) => (
                                        <Form.Check key={i} type="checkbox" className="no-border-checkbox m-1" label={m} checked={filters.assignedTo.includes(m)} onChange={() => toggleFilter("assignedTo", m)} />
                                    ))}
                                    <hr />
                                    <strong>Status</strong>
                                    {statusOptions.map((s, i) => (
                                        <Form.Check key={i} type="checkbox" className="no-border-checkbox m-1" label={s} checked={filters.status.includes(s)} onChange={() => toggleFilter("status", s)} />
                                    ))}
                                    <Button variant="link" className="mt-2 text-danger p-0" onClick={clearFilters}>Clear Filters</Button>
                                </div>
                            )}
                        </div>
                        <Form.Select
                            value={sortOption}
                            className="bg-dark text-white"
                            onChange={handleSortChange}
                            style={{ width: "220px" }}
                        >
                            <option value="">Sort By</option>
                            <option value="priorityHighLow">Priority (High → Low)</option>
                            <option value="priorityLowHigh">Priority (Low → High)</option>
                            <option value="dueDateRecent">Due Date (Most Recent First)</option>
                        </Form.Select>
                    </div>
                    {displayedTasks.length > 0 ? (
                        <Table variant="dark" responsive bordered hover className="mt-3 text-center" style={{wordWrap: "break-word"}}>
                            <thead className="table-dark">
                                <tr>
                                    <th style={{width: "30%"}}>Title</th>
                                    <th>Due Date</th>
                                    <th>Assigned To</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                            {displayedTasks.map((task, index) => (
                                <tr key={index}>
                                    <td>
                                        <button
                                            className="btn btn-link text-decoration-none p-0 text-white fw-bold"
                                                onClick={() => handleShowDetails(task)}
                                        >
                                            {task.title}
                                        </button>
                                    </td>
                                    <td>{new Date(task.dueDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </td>
                                    <td>
                                        <Dropdown onSelect={(val) => handleTaskChange(index, "assignedTo", val)}>
                                            <Dropdown.Toggle
                                                variant="dark"
                                                className="text-start"
                                                style={{
                                                    border: "1px solid #ccc",
                                                    color: getUserColor(task.assignedTo),
                                                }}
                                            >
                                                {task.assignedTo}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="bg-dark">
                                                {teamMembers.map((member, i) => (
                                                    <Dropdown.Item eventKey={member} key={i}>
                                                        <span style={{ color: getUserColor(member) }}>
                                                            {member}
                                                        </span>
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    <td>
                                        <Dropdown onSelect={(val) => handleTaskChange(index, "priority", val)}>
                                            <Dropdown.Toggle
                                                variant="dark"
                                                className="text-start"
                                                style={{ border: "1px solid #ccc" }}
                                            >
                                                <Badge bg={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="bg-dark">
                                                {priorityOptions.map((opt, i) => (
                                                    <Dropdown.Item eventKey={opt} key={i}>
                                                        <Badge bg={getPriorityVariant(opt)}>{opt}</Badge>
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    <td>
                                        <Dropdown onSelect={(val) => handleTaskChange(index, "status", val)}>
                                            <Dropdown.Toggle
                                                variant="dark"
                                                className="text-start"
                                                style={{
                                                    border: "1px solid #ccc",
                                                    color: getStatusColor(task.status),
                                                }}
                                            >
                                                {task.status}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="bg-dark">
                                                {statusOptions.map((status, i) => (
                                                    <Dropdown.Item eventKey={status} key={i}>
                                                        <span style={{ color: getStatusColor(status) }}>
                                                            {status}
                                                        </span>
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteTask(task._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-muted text-center mt-3 no-bg">No tasks added yet.</div>
                    )}
                </Card>
                {selectedTask && (
                    <div>
                        <Modal show={showModal} onHide={handleCloseModal} centered>
                            <Modal.Header closeButton className="modal-bg-dark">
                                <Modal.Title>Task Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="modal-bg-dark">
                                <p><strong>Description:</strong></p>
                                <p>{selectedTask.desc || "No description provided."}</p>
                                <p><strong>Title:</strong> {selectedTask.title}</p>
                                <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
                                <p><strong>Assigned To:</strong> {selectedTask.assignedTo}</p>
                                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                                <p><strong>Status:</strong> {selectedTask.status}</p>
                            </Modal.Body>
                            <Modal.Footer className="modal-bg-dark">
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                )}
            </div>
        </div>
    )
}
