import React, { use, useEffect,useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Card, Container, Row, Col, Badge, Button, InputGroup, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './GitStats.css';

const GitStats = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/repoStats", {
                withCredentials: true,
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching repo stats from backend:', error);
            alert('Failed to fetch repo stats from backend.');
        }
    };
    
    useEffect(() => {
        const fetchRepoUrlFromDb = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/repoUrl',{
                    withCredentials: true,
                  });
                if (response.data.gitRepoUrl) {
                    setRepoUrl(response.data.gitRepoUrl);
                    fetchStats(); // Fetch stats after setting the repo URL
                }
            } catch (error) {
                console.error('Error fetching repo url from db:', error);
            }
        };

        fetchRepoUrlFromDb();
    }, []);


    const handlefetch = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/repoUrl',{gitRepoUrl:repoUrl},{
                withCredentials: true,
              });
            setRepoUrl(repoUrl);
            alert("Repo url saved to db");
            fetchStats(); // Fetch stats after setting the repo URL
        } catch (error) {
            console.error('Error saving repo url to db:', error);
            alert('Failed to save repo url to db.');
        }
    };
    return (
        <div>
            <Navbar title="Github Stats"/>
            <Sidebar />
            <div className="task-container p-3">
                <Container className='mt-5 p-4 bg-dark text-start'>
                <InputGroup className='mb-4'>
                    <InputGroup.Text className='bg-black text-pink'>
                        GitHub Repository: 
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        className='dark-input'
                        placeholder="https://github.com/username/repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                    />
                    <Button variant="info" onClick={handlefetch}>
                        Fetch
                    </Button>
                </InputGroup>

                {stats && (
                    <Card className="p-4 stats-bg-gradient">
                        <h5><strong>{stats.name}</strong></h5>
                        <Row className="mb-3">
                            <Col><strong>PR:</strong> ✅ {stats.openPRs} ❎ {stats.closedPRs}</Col>
                            <Col><strong>Commits:</strong> {stats.commitsCount}</Col>
                            <Col>
                                {stats.languages.map(lang => (
                                    <Badge bg="info" text="dark" className="me-1" key={lang}>{lang}</Badge>
                                ))}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col><strong>Latest Commit</strong><br />Title: {stats.latestCommit.message}<br />By: {stats.latestCommit.author}</Col>
                            <Col><strong>About:</strong> {stats.deployedUrl}</Col>
                        </Row>

                        <Row className='mb-3'>
                            <Col><strong>Contributors:</strong> {stats.contributors.join(', ')}</Col>
                            <Col><strong>Created At:</strong> {stats.createdAt}</Col>
                            <Col><strong>Default Branch:</strong> {stats.defaultBranch}</Col>
                        </Row>
                    </Card>
                )}
                </Container>
            </div>
        </div>
    );
};

export default GitStats