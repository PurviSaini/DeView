import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Card, Container, Row, Col, Badge, Button, InputGroup, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './GitStats.css';

const GitStats = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [stats, setStats] = useState(null);

    const extractRepoInfo = (url) => {
        try {
            const path = new URL(url).pathname.split('/').filter(Boolean);
            return { owner: path[0], repo: path[1] };
        } catch {
            return null;
        }
    };

    const fetchRepoStats = async () => {
        const info = extractRepoInfo(repoUrl);
        if (!info) return alert('Invalid GitHub repo URL');

        try {
            const [repoRes, commitsRes, prsRes, langsRes, contribRes] = await Promise.all([
                axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}`),
                axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}/commits`),
                axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}/pulls?state=all`),
                axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}/languages`),
                axios.get(`https://api.github.com/repos/${info.owner}/${info.repo}/contributors`)
            ]);

            const openPRs = prsRes.data.filter(pr => pr.state === 'open');
            const closedPRs = prsRes.data.filter(pr => pr.state === 'closed');
            const latestCommit = commitsRes.data[0];

            setStats({
                name: repoRes.data.full_name,
                commitsCount: repoRes.data.commit_count || commitsRes.data.length,
                openPRs: openPRs.length,
                closedPRs: closedPRs.length,
                latestCommit: {
                    message: latestCommit.commit.message,
                    author: latestCommit.commit.author.name
                },
                languages: Object.keys(langsRes.data),
                deployedUrl: repoRes.data.homepage || 'N/A',
                contributors: contribRes.data.map(c => c.login).slice(0, 5),
                createdAt: new Date(repoRes.data.created_at).toLocaleDateString(),
                defaultBranch: repoRes.data.default_branch
            });
        } catch (err) {
            console.error(err);
            alert('Failed to fetch repo data');
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
                    <Button variant="info" onClick={fetchRepoStats}>
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