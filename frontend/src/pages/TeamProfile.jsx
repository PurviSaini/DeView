import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../context/SidebarContext";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
  FaGithub,
  FaLinkedin,
  FaDiscord,
  FaUser,
  FaRegWindowClose,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import "./TeamProfile.css";

// const getRandomColor = () => {
//   const colors = [
//     "#00aabc",
//     "#e67e22",
//     "#2ecc71",
//     "#9b59b6",
//     "#f39c12",
//     "#e74c3c",
//     "#1abc9c",
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

const TeamProfile = () => {
    const { isCollapsed } = useContext(SidebarContext);
  const [membersData, setMembersData] = useState([]);
  const [avatarColors, setAvatarColors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const teamMembers = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/team",
          { withCredentials: true }
        );
        const socialMediaHandles = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/getSocialMediaHandles",
          { usernames: teamMembers.data.members },
          { withCredentials: true }
        );

        const teamDetails = socialMediaHandles.data.map((handle, index) => {
          return {
            username: teamMembers.data.members[index],
            github: handle[0] ? handle[0] : "https://github.com/user-name",
            linkedin: handle[1]
              ? handle[1]
              : "https://linkedin.com/in/user-name",
            discord: handle[2] ? handle[2] : "#abcd112",
          };
        });

        setMembersData(teamDetails);

        const getUserColor = (username) => {
            const fixedColors = ['#e73cbf', '#a812f3', '#3498db', '#1abc9c'];
            const index = teamMembers.data.members.indexOf(username);
            return fixedColors[index % fixedColors.length];
        };  
        const assignedColors = teamMembers.data.members.map((_, i) =>
          getUserColor(teamMembers.data.members[i])
        );
        setAvatarColors(assignedColors);
      } catch (error) {
        console.log("Can't fetch the team Details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  const handleChange = (index, field, value) => {
    const updatedMembers = [...membersData];
    updatedMembers[index][field] = value;
    setMembersData(updatedMembers);
  };

  const handleMemberSave = (index) => {
    axios
      .patch(
        import.meta.env.VITE_BACKEND_URL + "/userDetails",
        { member: membersData[index] },
        { withCredentials: true }
      )
      .then((response) => {
        alert("changes saved successfully");
      })
      .catch((error) => {
        console.error("Error updating member data:", error);
      });
  };

  return (
    <div>
      <Navbar title="Team Profile" />
      <Sidebar />

      {loading && (
        <Loader
          message="Hang tight! Getting your team together"
          type="hourglass"
        />
      )}

      <div className={`task-container ${isCollapsed ? "collapsed" : ""} p-5`}>
        <Row className="justify-content-center m-1">
          {membersData.map((member, idx) => (
            <Col key={idx} md={3} sm={6} xs={12} className="">
              <Card
                className="text-white h-100"
                style={{ backgroundColor: "#111", borderRadius: "12px" }}
              >
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
                    <p className="text-center">
                      <strong className="fs-2">{member.username}</strong>
                    </p>

                    <Form.Group className="mb-3 text-start">
                      <Form.Label className="text-green border-0">
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green text-decoration-none"
                        >
                          <FaGithub className="me-2" /> Github
                        </a>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={member.github}
                        className="dark-input"
                        onChange={(e) =>
                          handleChange(idx, "github", e.target.value)
                        }
                        placeholder="https://github.com/user-name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 text-start">
                      <Form.Label className="text-blue border-0">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue text-decoration-none"
                        >
                          <FaLinkedin className="me-2" /> LinkedIn
                        </a>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={member.linkedin}
                        className="dark-input"
                        onChange={(e) =>
                          handleChange(idx, "linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/user-name"
                      />
                    </Form.Group>

                    <Form.Group className="text-start">
                      <Form.Label className="text-warning border-0">
                        <a
                          href={`https://discord.com/users/${member.discord}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-warning text-decoration-none"
                        >
                          <FaDiscord className="me-2" /> Discord
                        </a>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={member.discord}
                        className="dark-input"
                        onChange={(e) =>
                          handleChange(idx, "discord", e.target.value)
                        }
                        placeholder="abcd1234"
                      />
                    </Form.Group>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleMemberSave(idx)}
                    >
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

export default TeamProfile;
