import React, { use, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const [loading, setLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [stats, setStats] = useState(null);

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
      alert("Failed to fetch repo stats from backend.");
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
      alert("Repo url saved to db");
      fetchStats(); // Fetch stats after setting the repo URL
    } catch (error) {
      console.error("Error saving repo url to db:", error);
      alert("Failed to save repo url to db.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Navbar title="Github Stats" />
      <Sidebar />
      <div className="task-container p-3">
            {stats && (
              <h1 className="text-center text-white display-4 my-4 project-title">
                {stats.name}
              </h1>
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
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Loader /> {/* Show loader while loading */}
                </div>
                ) : (
                <>
              {stats && (
                <Card className="p-4 stats-bg-gradient text-white">
                  <Row className="mb-4">
                    <Col md={6}>
                      <h5>📊 Pull Requests</h5>
                      <p>
                        ✅ Open: {stats.openPRs} | ❎ Closed: {stats.closedPRs}
                      </p>
                    </Col>
                    <Col md={6}>
                      <h5>🚀 Total Commits</h5>
                      <p>{stats.commitsCount}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <h5>🔁 Latest Commit</h5>
                      <p>
                        <strong>Title:</strong> {stats.latestCommit.message}
                      </p>
                      <p>
                        <strong>By:</strong> {stats.latestCommit.author}
                      </p>
                    </Col>
                    <Col md={6}>
                      <h5>🌐 Deployed URL</h5>
                      <p>{stats.deployedUrl}</p>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <h5>🛠️ Languages</h5>
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
                    </Col>
                    <Col md={6}>
                      <h5>👥 Top Contributors</h5>
                      <p>{stats.contributors.join(", ")}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <h5>🌿 Default Branch</h5>
                      <p>{stats.defaultBranch}</p>
                    </Col>
                    <Col md={6}>
                      <h5>📅 Created On</h5>
                      <p>{stats.createdAt}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
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
                            {stats.sortedFiles.map((f) => (
                              <tr key={f.filename}>
                                <td>{f.filename}</td>
                                <td>{f.changes}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}
              </>
              )}
            </Container>
      </div>
    </div>
  );
};

export default GitStats;
