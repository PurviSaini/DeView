import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Form,
  Card,
  Container,
  Row,
  Col,
  Badge,
  Button,
  InputGroup,
  FormGroup,
  ListGroup,
  Placeholder,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import "./GitStats.css";

const GitStats = () => {
  const { isCollapsed } = useContext(SidebarContext);
  const [loading, setLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [stats, setStats] = useState({
    openPRs: 0,
    closedPRs: 0,
    commitsCount: 0,
    latestCommit: { message: "", author: "" },
    deployedUrl: "",
    languages: [],
    contributors: [],
    defaultBranch: "",
    createdAt: "",
    sortedFiles: [],
    recentMostFiles: [],
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/repoStats",
        {
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching repo stats from backend:", error);
      toast.error("Failed to fetch repo stats from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRepoUrlFromDb = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/repoUrl",
          {
            withCredentials: true,
          }
        );
        if (response.data.gitRepoUrl) {
          setRepoUrl(response.data.gitRepoUrl);
          fetchStats(); // Fetch stats after setting the repo URL
        }
      } catch (error) {
        console.error("Error fetching repo url from db:", error);
      }
    };

    fetchRepoUrlFromDb();
  }, []);

  const handlefetch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/repoUrl",
        { gitRepoUrl: repoUrl },
        {
          withCredentials: true,
        }
      );
      setRepoUrl(repoUrl);
      toast.success("Github Repository URL saved successfully!");
      fetchStats(); // Fetch stats after setting the repo URL
    } catch (error) {
      console.error("Error saving repo url to db:", error);
      toast.error("Failed to save repo url to db.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Navbar title="Github Stats" />
      <Sidebar />
      <div className={`task-container ${isCollapsed ? "collapsed" : ""} p-3`}>
        {loading ? (
          <Placeholder as="h1" animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
        ) : (
          stats && (
            <h1 className="text-center text-white display-4 my-4 project-title">
              {stats.name}
            </h1>
          )
        )}
        <Container fluid="md" className="mx-5 p-4 bg-dark text-start">
          <InputGroup className="mb-4">
            <InputGroup.Text className="bg-black text-pink">
              GitHub Repository:
            </InputGroup.Text>
            <Form.Control
              type="text"
              className="dark-input"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <Button variant="info" onClick={handlefetch}>
              Fetch
            </Button>
          </InputGroup>
          
            <Card className="p-4 stats-bg-gradient text-white">
              <Row className="mb-4">
                <Col md={6}>
                  <h5>📊 Pull Requests</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} /> <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>
                      ✅ Open: {stats.openPRs} | ❎ Closed: {stats.closedPRs}
                    </p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>🚀 Total Commits</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>{stats.commitsCount}</p>
                  )}
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h5>🔁 Latest Commit</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>
                      <strong>Title:</strong> {stats.latestCommit.message}
                    </p>
                  )}
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>
                      <strong>By:</strong> {stats.latestCommit.author}
                    </p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>🌐 Deployed URL</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>{stats.deployedUrl}</p>
                  )}
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <h5>🛠️ Languages</h5>
                  {loading ? (
                    <Placeholder.Button
                      variant="info"
                      xs={2}
                      className="me-2"
                      animation="glow"
                    />
                  ) : (
                    <div>
                      {stats.languages.map((lang) => (
                        <Badge
                          bg="info"
                          text="dark"
                          className="me-2 mb-1"
                          key={lang}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <h5>👥 Top Contributors</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>{stats.contributors.join(", ")}</p>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <h5>🌿 Default Branch</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>{stats.defaultBranch}</p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>📅 Created On</h5>
                  {loading ? (
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  ) : (
                    <p>{stats.createdAt}</p>
                  )}
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mt-4 text-white">
                    <h5>📁 Most Changed Files</h5>
                    <table className="table table-dark table-striped">
                      <thead>
                        <tr>
                          <th>File</th>
                          <th>Changes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading
                          ? [...Array(3)].map((_, i) => (
                              <tr key={i}>
                                <td>
                                  <Placeholder as="span" animation="glow">
                                    <Placeholder xs={6} />
                                  </Placeholder>
                                </td>
                                <td>
                                  <Placeholder as="span" animation="glow">
                                    <Placeholder xs={2} />
                                  </Placeholder>
                                </td>
                              </tr>
                            ))
                          : stats.sortedFiles.map((f) => (
                              <tr key={f.filename}>
                                <td>{f.filename}</td>
                                <td>{f.changes}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mt-4 text-white">
                    <h5>📂 Recently Used Files</h5>
                    <ListGroup variant="flush">
                      {loading
                        ? [...Array(4)].map((_, i) => (
                            <ListGroup.Item
                              key={i}
                              className="bg-dark text-white border-secondary rounded mb-2"
                            >
                              <Placeholder as="span" animation="glow">
                                <Placeholder xs={8} />
                              </Placeholder>
                            </ListGroup.Item>
                          ))
                        : stats.recentMostFiles.map((file, index) => (
                            <ListGroup.Item
                              key={index}
                              className="d-flex justify-content-between align-items-center bg-dark text-white border-secondary rounded mb-2"
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.95rem",
                              }}
                            >
                              <span>
                                <i className="bi bi-file-earmark-code me-2 text-info"></i>
                                {file}
                              </span>
                              <Badge bg="secondary" pill>
                                #{index + 1}
                              </Badge>
                            </ListGroup.Item>
                          ))}
                    </ListGroup>
                  </div>
                </Col>
              </Row>
            </Card>
        </Container>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GitStats;
