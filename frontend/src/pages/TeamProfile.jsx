import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button} from "react-bootstrap";
import { FaGithub, FaLinkedin, FaDiscord, FaUser } from "react-icons/fa";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './TeamProfile.css';

const getRandomColor = () => {
    const colors = ["#00aabc", "#e67e22", "#2ecc71", "#9b59b6", "#f39c12", "#e74c3c", "#1abc9c"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const TeamProfile = () => {
    const teamMembers = [
        {
          username: "member1",
          github: "",
          linkedin: "",
          discord: "",
        },
        {
          username: "alice",
          github: "",
          linkedin: "",
          discord: "",
        },
        {
          username: "Charlie",
          github: "",
          linkedin: "",
          discord: "",
        },
        {
          username: "Dolly",
          github: "",
          linkedin: "",
          discord: "",
        }
    ];
    
    const [membersData, setMembersData] = useState([]);
    const [avatarColors, setAvatarColors] = useState([]);
    
    useEffect(() => {
        if (teamMembers.length > 0 && avatarColors.length === 0) {
            const assignedColors = teamMembers.map(() => getRandomColor());
            setAvatarColors(assignedColors);
            setMembersData(teamMembers);
        }
    }, [teamMembers]);
      
    
    const handleChange = (index, field, value) => {
        const updatedMembers = [...membersData];
        updatedMembers[index][field] = value;
        setMembersData(updatedMembers);
    };
    
    const handleMemberSave = (index) => {
        const member = membersData[index];
        console.log("Saving member data:", member);
        alert(`Changes saved for ${member.username} (See console for data)`);
        // Optional: Send member data to backend here
    };

    return (
        <div>
            <Navbar title="Team Profile"/>
            <Sidebar />
            <div className="task-container p-5">
                <Row className="justify-content-center m-1">
                    {membersData.map((member, idx) => (
                        <Col key={idx} md={3} sm={6} xs={12} className="">
                            <Card className="text-white h-100" style={{ backgroundColor: "#111", borderRadius: "12px" }}>
                                <Card.Body className="text-center bg-member-profile">
                                    <div>
                                        <div
                                            className="mx-auto mb-4"
                                            style={{
                                                backgroundColor: avatarColors[idx],
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "36px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {member.username[0].toUpperCase()}
                                        </div>
                                        <p className='text-start'><FaUser className="me-2 text-white" /> <strong>Username:</strong> <em>{member.username}</em></p>

                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label className="text-green border-0">
                                                <FaGithub className="me-2" /> Github Username:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={member.github}
                                                className="dark-input"
                                                onChange={(e) => handleChange(idx, "github", e.target.value)}
                                                placeholder='https://github.com/user-name'
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label className="text-blue border-0">
                                                <FaLinkedin className="me-2" /> LinkedIn:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={member.linkedin}
                                                className="dark-input"
                                                onChange={(e) => handleChange(idx, "linkedin", e.target.value)}
                                                placeholder='https://linkedin.com/in/user-name'
                                            />
                                        </Form.Group>

                                        <Form.Group className="text-start">
                                            <Form.Label className="text-warning border-0">
                                                <FaDiscord className="me-2" /> Discord ID:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={member.discord}
                                                className="dark-input"
                                                onChange={(e) => handleChange(idx, "discord", e.target.value)}
                                                placeholder='abcd1234'
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="mt-4">
                                        <Button variant='info' size="sm" onClick={() => handleMemberSave(idx)}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default TeamProfile