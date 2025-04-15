import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Container, Row, Col, Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Resources.css'
import { useState } from "react";

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export default function Resources(){
  const [messages, setMessages] = useState([]); // resource url saved on page
  const [input, setInput] = useState(''); // resource url inputted in the input box

  const handleSend = () => {
    if (input.trim() !== '') {
      setMessages([...messages, input]);
      setInput('');
    }
  };
//   const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };

  return (
    <div>
        <Navbar title = "Resources"/>
        <Sidebar/>
    <Container fluid className="d-flex flex-column p-3 resources-container">
      {/* Message Boxes */}
      <div className="flex-grow-1 overflow-auto mb-3">
        {messages.map((msg, index) => (
          <div key={index} style={{ borderColor: getRandomColor()}} className="p-3 mb-2 bg-light rounded shadow-sm resource-box">
            {msg}
          </div>
        ))}
      </div>

      {/* Input and Send Button */}
      <Form className="resource-form">
        <Row className="align-items-center">
          <Col xs={11}>
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="input-resource"
            />
          </Col>
          <Col xs={1}>
            <Button onClick={handleSend} variant="primary" className="w-100 btn-send">
               <i class="fa fa-send-o"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
    </div>
  );
}