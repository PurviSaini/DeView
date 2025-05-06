import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { Form, Button, Col, Row, Container, Card, Collapse } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import "./Ideator.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ideator = () => {
  const [loading, setLoading] = useState(false);
  const { isCollapsed } = useContext(SidebarContext);

  const [formData, setFormData] = useState({
    theme: "",
    teamSize: "",
    duration: "",
    deadline: "",
    skills: [],
    complexity: "",
    techStack: "",
    deployment: "",
    outputs: [],
    references: [],
    otherReference: "",
  });
  const [submittedData, setSubmittedData] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/ideas",
          { withCredentials: true }
        );
        if (res.data) setSubmittedData(res.data.reverse()); // now an array of ideas
      } catch (err) {
        console.log("No saved ideas found for this team.");
      }
    };

    fetchIdeas();
  }, []);

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/idea",
        formData,
        { withCredentials: true }
      );
      const generatedIdea = response.data.generatedIdea;

      const combinedData = {
        ...formData,
        generatedIdea,
        _id: response.data._id, // Assuming the backend returns the ID of the created idea
      };

      setSubmittedData((prev) => [combinedData, ...prev]);
      // Reset form
      setFormData({
        theme: "",
        teamSize: "",
        duration: "",
        deadline: "",
        skills: [],
        complexity: "",
        techStack: "",
        deployment: "",
        outputs: [],
        references: [],
        otherReference: "",
      });
      setOpenForm(false);
    } catch (error) {
      console.error("Error submitting to backend:", error);
      toast.error("Failed to submit or generate idea.");
    } finally {
      setLoading(false); // stop loader
    }
  };

  const handleDeleteIdea = async (indexToDelete, ideaId) => {
    if (confirm("Are you sure you want to delete this idea?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/idea/${ideaId}`,
          { withCredentials: true }
        );
        setSubmittedData((prev) =>
          prev.filter((_, index) => index !== indexToDelete)
        );
        toast.success("Idea deleted successfully!");
      } catch (error) {
        console.error("Error deleting idea from DB:", error);
        toast.error("Failed to delete idea.");
      }
    }
  };

  // if (loading) {
  //   return <Loader message="Submitting your idea..." />;
  // }

  return (
    <div>
      <Navbar title="Ideator" />
      <Sidebar />
      <div className={`task-container ${isCollapsed ? 'collapsed' : ''} p-3`}>
        <div className="wrapper-div p-1 m-3 ms-5 rounded-4">
          <Card className="p-4 bg-dark text-white rounded-4">
            <Card.Title className="text-center mb-4 display-6">
              Idea Generator
            </Card.Title>
            <div className="mb-3">
              <Button
                onClick={() => setOpenForm(!openForm)}
                aria-controls="idea-form-collapse"
                aria-expanded={openForm}
                variant="dark"
                className="w-100 text-center fw-bold"
              >
                {openForm ? 'Collapse ▲' : 'Click to Generate New Idea ▼'}
              </Button>

              <Collapse in={openForm}>
                <div id="idea-form-collapse" className="mt-3 p-3 border rounded bg-dark text-light">
                  <Form
                    onSubmit={handleSubmit}
                    className="m-0 p-0 text-start border-0"
                  >
                    <Row className="mb-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>1. Theme</Form.Label>
                          <Form.Control
                            type="text"
                            className="dark-input"
                            name="theme"
                            placeholder="e.g. HealthTech"
                            value={formData.theme}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>2. Team size</Form.Label>
                          <Form.Select
                            name="teamSize"
                            className="dark-input"
                            value={formData.teamSize}
                            onChange={handleChange}
                          >
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
                          <Form.Control
                            type="text"
                            className="dark-input"
                            name="duration"
                            placeholder="e.g. 4 weeks"
                            value={formData.duration}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>4. Deadline</Form.Label>
                          <Form.Control
                            type="date"
                            className="dark-input"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>6. Skills</Form.Label>
                      <br />
                      {[
                        "Frontend",
                        "Backend",
                        "AI/ML",
                        "UI/UX",
                        "Data Science",
                        "Cloud/DevOps",
                        "Mobile",
                        "Other",
                      ].map((skill) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={skill}
                          value={skill}
                          key={skill}
                          checked={formData.skills.includes(skill)}
                          onChange={(e) => handleCheckboxChange(e, "skills")}
                        />
                      ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>7. Complexity</Form.Label>
                      <br />
                      {["Beginner friendly", "Intermediate", "Advanced"].map(
                        (level) => (
                          <Form.Check
                            inline
                            type="radio"
                            name="complexity"
                            label={level}
                            value={level}
                            key={level}
                            checked={formData.complexity === level}
                            onChange={handleChange}
                          />
                        )
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>8. Tech Stack</Form.Label>
                      <Form.Control
                        type="text"
                        className="dark-input"
                        name="techStack"
                        placeholder="e.g. MERN, Flutter, etc."
                        value={formData.techStack}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>9. Deployment</Form.Label>
                      <br />
                      <Form.Check
                        inline
                        type="radio"
                        label="Yes"
                        name="deployment"
                        value="Yes"
                        checked={formData.deployment === "Yes"}
                        onChange={handleChange}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="No"
                        name="deployment"
                        value="No"
                        checked={formData.deployment === "No"}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>10. Expected Outputs</Form.Label>
                      <br />
                      {[
                        "Working Prototype",
                        "GitHub Repo",
                        "Demo Video",
                        "Pitch Deck",
                        "Live Deployment",
                        "Others",
                      ].map((output) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={output}
                          value={output}
                          key={output}
                          checked={formData.outputs.includes(output)}
                          onChange={(e) => handleCheckboxChange(e, "outputs")}
                        />
                      ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>11. References</Form.Label>
                      <br />
                      {[
                        "GitHub project links",
                        "Tutorials",
                        "API documentation",
                        "Research papers",
                      ].map((ref) => (
                        <Form.Check
                          inline
                          type="checkbox"
                          label={ref}
                          value={ref}
                          key={ref}
                          checked={formData.references.includes(ref)}
                          onChange={(e) => handleCheckboxChange(e, "references")}
                        />
                      ))}
                      <Form.Check
                        type="checkbox"
                        label="Other"
                        value="Other"
                        checked={formData.otherReference === "Other"}
                        onChange={(e) => handleCheckboxChange(e, "references")}
                      />
                      <Form.Control
                        className="mt-2 dark-input"
                        placeholder="If other, specify here"
                        name="otherReference"
                        value={formData.otherReference}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <div className="text-center">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="px-5 rounded-pill"
                        disabled={loading}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
              </Collapse>
            </div>
          </Card>
        </div>

        {/* {loading && <Loader />} */}
        {/* <Loader message="Submitting your idea"/> */}

        {loading && <Loader message="Just few more seconds, and your idea will be ready" type="boxes" />}
        {/* or message="Almost there! Crafting your idea..." */}

        {submittedData.length > 0 && ( //change start
          <>
            <h4 className="text-center my-4 text-white">Submitted Ideas</h4>

            {submittedData.map((data, index) => (
              <Card
                key={data._id || index}
                className="p-4 m-5 wrapper-div rounded-4 text-start"
              >
                {data.generatedIdea && (
                  <div className="d-flex justify-content-between align-items-start">
                    <p className="generated-idea mb-2">
                      <strong>Generated Project Idea:</strong>
                      <br />
                      <ReactMarkdown>{data.generatedIdea}</ReactMarkdown>
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteIdea(index, data._id)}
                      className="ms-3"
                      title="Delete Idea"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
  
};

export default Ideator;
