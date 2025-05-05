import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button} from "react-bootstrap";
import { FaGithub, FaLinkedin, FaDiscord, FaUser, FaRegWindowClose } from "react-icons/fa";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './TeamProfile.css';

const getRandomColor = () => {
    const colors = ["#00aabc", "#e67e22", "#2ecc71", "#9b59b6", "#f39c12", "#e74c3c", "#1abc9c"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const TeamProfile = () => {
    const [membersData, setMembersData] = useState([]);
    const [avatarColors, setAvatarColors] = useState([]);
        
    useEffect(() => {
        const fetchTeamMembers = async() => {
            try{
                const teamMembers = await axios.get(import.meta.env.VITE_BACKEND_URL + "/team",{withCredentials:true});
                const socialMediaHandles = await axios.post(import.meta.env.VITE_BACKEND_URL + "/getSocialMediaHandles",{usernames:teamMembers.data.members}, {withCredentials:true});
                
                const teamDetails = socialMediaHandles.data.map((handle, index) => {
                    return {
                        username: teamMembers.data.members[index],
                        github: handle[0] ? handle[0] : "https://github.com/user-name",
                        linkedin: handle[1] ? handle[1] : "https://linkedin.com/in/user-name",
                        discord: handle[2] ? handle[2] : "#abcd112",
                       
                    };
                });
            
                setMembersData(teamDetails);
                const assignedColors = teamMembers.data.members.map(() => getRandomColor());
                setAvatarColors(assignedColors);

            }catch(error){
                console.log("Can't fetch the team Details",error)
            }

        }
        fetchTeamMembers();
    },[]);
    
    
    const handleChange = (index, field, value) => {
        const updatedMembers = [...membersData];
        updatedMembers[index][field] = value;
        setMembersData(updatedMembers);
    };
    
    const handleMemberSave = (index) => {
        axios.patch(import.meta.env.VITE_BACKEND_URL + "/userDetails", {member:membersData[index]}, {withCredentials:true}).then(response => {
            alert("changes saved successfully");
        }).catch(error => {
            console.error("Error updating member data:", error);
        });
        
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
                                        <p className='text-center'><strong className='fs-2'>{member.username}</strong></p>

                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label className="text-green border-0">
                                                <FaGithub className="me-2" /> Github
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
                                                <FaLinkedin className="me-2" /> LinkedIn
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
                                                <FaDiscord className="me-2" /> Discord
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