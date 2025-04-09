import React, { useState } from 'react';
import { Form, Button, Col, Row, Container, Card } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Ideator.css';

const Ideator = () => {
  const [formData, setFormData] = useState({
    theme: '',
    teamSize: '',
    duration: '',
    deadline: '',
    skills: [],
    complexity: '',
    techStack: '',
    deployment: '',
    outputs: [],
    references: [],
    otherReference: ''
  });
  const [submittedData, setSubmittedData] = useState(null);

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(v => v !== value)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // const response = await axios.post(import.meta.env.VITE_BACKEND_URL+ "/user/ideator", formData);
      // console.log('Submitted:', response.data);
  
      setSubmittedData(formData); // Store form data to display it
      setFormData({
        theme: '',
        teamSize: '',
        duration: '',
        deadline: '',
        skills: [],
        complexity: '',
        techStack: '',
        deployment: '',
        outputs: [],
        references: [],
        otherReference: '',
      });      
      // Optionally reset formData here if needed
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    
    <div>
        <Sidebar/>
        <Navbar title="Ideator"/>
        <div className="task-container p-3">
            <div className='wrapper-div p-1 m-3 ms-5 rounded-4'>
                <Card className="p-4 bg-dark text-white rounded-4">
                    <Card.Title className="text-center mb-4 display-6">Idea Generator</Card.Title>
        <Form onSubmit={handleSubmit} className='m-0 p-0 text-start border-0'>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>1. Theme</Form.Label>
                <Form.Control type="text" className='dark-input' name="theme" placeholder="e.g. HealthTech" value={formData.theme} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>2. Team size</Form.Label>
                <Form.Select name="teamSize" className='dark-input' value={formData.teamSize} onChange={handleChange}>
                  <option value="">Select team size</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </Form.Select>

              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>3. Duration</Form.Label>
                <Form.Control type="text" className='dark-input' name="duration" placeholder="e.g. 4 weeks" value={formData.duration} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>4. Deadline</Form.Label>
                <Form.Control type="date" className='dark-input' name="deadline" value={formData.deadline} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>6. Skills</Form.Label><br />
            {['Frontend', 'Backend', 'AI/ML', 'UI/UX', 'Data Science', 'Cloud/DevOps', 'Mobile', 'Other'].map(skill => (
              <Form.Check inline type="checkbox" label={skill} value={skill} key={skill} onChange={(e) => handleCheckboxChange(e, 'skills')} />
            ))}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>7. Complexity</Form.Label><br />
            {['Beginner friendly', 'Intermediate', 'Advanced'].map(level => (
              <Form.Check inline type="radio" name="complexity" label={level} value={level} key={level} onChange={handleChange} />
            ))}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>8. Tech Stack</Form.Label>
            <Form.Control type="text" className='dark-input' name="techStack" placeholder="e.g. MERN, Flutter, etc." value={formData.techStack} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>9. Deployment</Form.Label><br />
            <Form.Check inline type="radio" label="Yes" name="deployment" value="Yes" onChange={handleChange} />
            <Form.Check inline type="radio" label="No" name="deployment" value="No" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>10. Expected Outputs</Form.Label><br />
            {['Working Prototype', 'GitHub Repo', 'Demo Video', 'Pitch Deck', 'Live Deployment', 'Others'].map(output => (
              <Form.Check inline type="checkbox" label={output} value={output} key={output} onChange={(e) => handleCheckboxChange(e, 'outputs')} />
            ))}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>11. References</Form.Label><br />
            {['GitHub project links', 'Tutorials', 'API documentation', 'Research papers'].map(ref => (
              <Form.Check inline type="checkbox" label={ref} value={ref} key={ref} onChange={(e) => handleCheckboxChange(e, 'references')} />
            ))}
            <Form.Check type="checkbox" label="Other" value="Other" onChange={(e) => handleCheckboxChange(e, 'references')} />
            <Form.Control className="mt-2 dark-input" placeholder="If other, specify here" name="otherReference" value={formData.otherReference} onChange={handleChange} />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" size="lg" className="px-5 rounded-pill">Submit</Button>
          </div>
        </Form>
      </Card>
      </div>
      {submittedData && (
        <Card className="p-4 m-5 wrapper-div rounded-4 text-start">
          <h4 className="text-center mb-3">Submitted Idea Details</h4>
          <p><strong>Theme:</strong> {submittedData.theme}</p>
          <p><strong>Team Size:</strong> {submittedData.teamSize}</p>
          <p><strong>Duration:</strong> {submittedData.duration}</p>
          <p><strong>Deadline:</strong> {submittedData.deadline}</p>
          <p><strong>Skills:</strong> {submittedData.skills.join(', ')}</p>
          <p><strong>Complexity:</strong> {submittedData.complexity}</p>
          <p><strong>Tech Stack:</strong> {submittedData.techStack}</p>
          <p><strong>Deployment:</strong> {submittedData.deployment}</p>
          <p><strong>Outputs:</strong> {submittedData.outputs.join(', ')}</p>
          <p><strong>References:</strong> {submittedData.references.join(', ')}</p>
          {submittedData.otherReference && (
            <p><strong>Other Reference:</strong> {submittedData.otherReference}</p>
          )}
      </Card>
    )}
    </div>
</div>
    
  );
};

export default Ideator;