import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Container, Row, Col } from 'react-bootstrap';
import './Documentation.css'

const content = "lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf.lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf. lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf. lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf. lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf.lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf. lorem kjd rjgn rjngosjkdfn knf rjfnsldi ekfmwoie eekfwoijt ekekfnj kefo wkfnowienf cjifjoifnkdmf";

export default function Documentation(){
    return (
        <div>
            <Navbar title="Documentation"/>
            <Sidebar/>
            <Container className="mt-4">
                <Row>
                    <Col md={6}>
                    <div id='left-container' className="p-4 text-white text-center rounded">{content}</div>
                    </Col>
                    <Col md={6}>
                    <div id='right-container' className="p-4 text-white text-center rounded">{content}</div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}