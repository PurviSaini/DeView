import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Team.css'; 
import team2 from "../assets/team2.png";
import jointeam from '../assets/jointeam.png';
import Navbar from '../components/Navbar'

const Team = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const handleJoinTeam = async (e) => {
        e.preventDefault();
        if (!teamCode) {
            setShowAlert(true);
            return;
        }

        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/updateUser", {
                code: teamCode,
            });
    
            alert(`Joined team successfully!`);
            console.log(response.data);
            setShowAlert(false);
            navigate('/task');
        } catch (error) {
            console.error('Error joining team:', error);
            alert('Failed to join team. Please check the code.');
        }
    };

    const generateTeamCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleCreateTeam = () => {
        const generatedCode = generateTeamCode();
        navigator.clipboard.writeText(generatedCode);
        alert(`Team created! Code copied: ${generatedCode}`);
        setInputValue(generatedCode);
    };


    return (
        <div className="dark-page">
        <Navbar />
        <Container>
            <section>
                <center>
                    <h1 className='text-light mt-4'>Join a team</h1>
                </center>
                <Row className="justify-content-center text-center mt-5 vh-100">
                    <Col md={8} lg={6} >
                        <Card className="neon-box p-4 dark-card bg-dark">
                            <p className="text-white">Want to start a team?</p>
                            <Button variant="outline-light btn-primary" onClick={handleCreateTeam}>
                                Create your team
                            </Button>
                            <p className="mt-2 text-light">Click to get your unique <span className='color-pink'>team code</span></p>
                            <input type="text" className='dark-input w-100' id='teamCodeDisplay' value={inputValue} readOnly/>
                            <p className="mt-2 text-light"><span className='color-pink'>Scroll down</span> to join.</p>
                        </Card>
                    </Col>
                    <Col>
                        <div className='image-container mt-0'>
                            <img src={jointeam} alt="team" className='img-fluid' />
                        </div>
                    </Col>
                </Row>
            </section>
            <Row className="justify-content-center text-center align-items-center vh-100">
                <Col xs={12} md={6} >
                    <div className='image-container mb-4 p-2'>
                        <img src={team2} alt="team" className='img-fluid' />
                    </div>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="neon-box p-4 dark-card bg-dark">
                        <center><p className="text-white">Join a team with <span className='color-pink'>code</span>.</p></center>
                        <Form onSubmit={handleJoinTeam} className='m-0 p-0 border-0 form-join'>
                            <Form.Group controlId="formTeamCode">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter team code"
                                    value={teamCode}
                                    onChange={(e) => setTeamCode(e.target.value)}
                                    className="dark-input"
                                />
                            </Form.Group>
                            <Button variant="outline-light" type="submit" className="mt-3">
                                Join Team
                            </Button>
                        </Form>
                        {showAlert && (
                            <Alert variant="danger" className="mt-3">
                                Please enter a valid team code.
                            </Alert>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  );
};

export default Team;
