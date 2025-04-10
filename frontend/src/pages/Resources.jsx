import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Container, Row, Col } from 'react-bootstrap';
import './Resources.css'

export default function Resources(){
    return (
        <div>
            <Navbar title = "Resources"/>
            <Sidebar/>

            <div className="resource-container">
                <Container className="mt-4">
                    <Row>
                        <Col>
                        <div className="p-4 bg-primary text-white text-center mb-3 rounded">Box 1</div>
                        <div className="p-4 bg-success text-white text-center mb-3 rounded">Box 2</div>
                        <div className="p-4 bg-warning text-dark text-center rounded">Box 3</div>
                        </Col>
                    </Row>
                </Container>
                <div id="link-input">
                    <input type="url" name="resource-link" id="resource-link" /> 
                    <button id="submit-link"><i class="fa fa-send-o"></i></button>
                </div>
            </div>
        </div>
    )
}