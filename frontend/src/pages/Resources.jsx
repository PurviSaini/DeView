import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Placeholder,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Resources.css";
import axios from "axios";
import { useEffect, useState } from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function Resources() {
  const [messages, setMessages] = useState([]); // resource url saved on page
  const [input, setInput] = useState(""); // resource url inputted in the input box
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/resources",
          { withCredentials: true }
        );
        if (Array.isArray(response.data)) {
          const resourcesWithColors = response.data.map((msg) => ({
            ...msg,
            color: getRandomColor(),
          }));
          setMessages(resourcesWithColors);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        setMessages([]); // Fallback to an empty array in case of an error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleSend = async () => {
    if (input.trim() !== "") {
      setLoading(true);
      try {
        const color = getRandomColor();
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/resources",
          { message: input }, // sending only the message to backend
          { withCredentials: true }
        );

        // Locally attach color to the received message
        const newMessage = { ...response.data, color };

        setMessages([...messages, newMessage]);
        setInput("");
      } catch (error) {
        console.error("Error sending resource:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (index) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      setLoading(true);
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/resources/${index}`,
          { withCredentials: true }
        );
        const updatedMessages = messages.filter(
          (_, msgIndex) => msgIndex !== index
        );
        setMessages(updatedMessages);
      } catch (error) {
        console.error("Error deleting resource:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar title="Resources" />
      <Sidebar />

      <Container fluid className="d-flex flex-column p-3 resources-container">
        {/* Message Boxes */}
        <div className="flex-grow-1 overflow-auto mb-3">
          {Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{ borderColor: msg.color }}
                className="p-3 mb-2 bg-light rounded shadow-sm resource-box position-relative"
              >
                {/* Sender Name */}
                <div className="position-absolute top-0 start-0 p-2 sender-name">
                  {msg.sender}
                </div>

                {/* Delete Button */}
                <button
                  className="position-absolute top-0 end-0 btn btn-sm btn-danger btn-delete-resource"
                  onClick={() => handleDelete(index)}
                >
                  <i className="fa fa-trash-o"></i>
                </button>

                {/* Message Content */}
                <div className="mt-4">{msg.message}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No resources available.</p>
          )}
        </div>

        {loading && 
        <Loader message="Loading Messages" type="hourglass" />
        }

        {/* Input and Send Button */}
        <Form className="resource-form">
          <Row className="align-items-center">
            <Col xs={11}>
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submission
                    handleSend(); // Call your handleSend function
                  }
                }}
                className="input-resource"
              />
            </Col>
            <Col xs={1}>
              <Button
                onClick={handleSend}
                variant="primary"
                className="w-100 btn-send"
              >
                <i className="fa fa-send-o"></i>
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}
