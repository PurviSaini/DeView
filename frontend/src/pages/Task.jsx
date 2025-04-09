import React, { useState,useEffect } from "react";
import axios from 'axios';
import { Form, Button, Card, Row, Col, Table, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import './Task.css'

export default function Task(){
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);

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
  }, []);

    const handleShowDetails = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setShowModal(false);
    };

    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        dueDate: "",
        assignedTo: "",
        priority: "",
        description: "",
    });

    const priorityOptions = ["High", "Medium", "Low"];
    const statusOptions = ["To Do", "Ongoing", "Completed"];

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
            status: "To Do", // default status
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
                description:"",
            });
            alert("Task added successfully!");
        } catch (err) {
            alert("Failed to add task");
            console.error(err);
        }
    };

    const handleTaskChange = async (index, field, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index][field] = value;
        setTasks(updatedTasks);

        const taskId = updatedTasks[index]._id;

        try {
            await axios.patch(
                import.meta.env.VITE_BACKEND_URL+ "/tasks" + `/${taskId}`,
                { [field]: value },{
                    withCredentials: true,
                  }
            );
            console.log(`Task ${taskId} field '${field}' updated to '${value}'`);
        } catch (err) {
            alert("Failed to update task field");
            console.error(err);
        }
    };

    const handleDeleteTask = async (index) => {
        const taskId = tasks[index]._id;
        try {
          await axios.delete(import.meta.env.VITE_BACKEND_URL+ "/tasks" + `/${taskId}`,{
            withCredentials: true,
          });
          const updatedTasks = tasks.filter((_, i) => i !== index);
          setTasks(updatedTasks);
        } catch (err) {
          console.error("Failed to delete task", err);
          alert("Error deleting task");
        }
      };

    return (
        <div>
            <Sidebar/>
            <Navbar title="Tasks"/>

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
                                        name="description"
                                        className="dark-input"
                                        value={formData.description}
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
                    {tasks.length > 0 ? (
                        <div className="no-bg">
                        <Table bg-none responsive bordered hover className="mt-3 text-center no-bg">
                            <thead className="table-dark">
                                <tr>
                                    <th>Title</th>
                                    <th>Due Date</th>
                                    <th>Assigned To</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                            {tasks.map((task, index) => (
                                <tr key={index}>
                                    <td>
                                        <button
                                            className="btn btn-link text-decoration-none p-0 text-dark"
                                                onClick={() => handleShowDetails(task)}
                                        >
                                            {task.title}
                                        </button>
                                    </td>
                                    <td>{task.dueDate}</td>
                                    <td>
                                        <Form.Select
                                            value={task.assignedTo}
                                            onChange={(e) =>
                                                handleTaskChange(index, "assignedTo", e.target.value)
                                            }
                                        >
                                            {teamMembers.map((member, i) => (
                                                <option key={i} value={member}>
                                                {member}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Select
                                            value={task.priority}
                                            onChange={(e) =>
                                                handleTaskChange(index, "priority", e.target.value)
                                            }
                                        >
                                            {priorityOptions.map((opt, i) => (
                                                <option key={i} value={opt}>
                                                {opt}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Select
                                            value={task.status}
                                            onChange={(e) =>
                                                handleTaskChange(index, "status", e.target.value)
                                            }
                                        >
                                            {statusOptions.map((opt, i) => (
                                                <option key={i} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="rounded-pill calendar-dark"
                                            onClick={() => handleDeleteTask(index)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        </div>
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
                                <p>{selectedTask.description || "No description provided."}</p>
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