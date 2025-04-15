import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Documentation.css'


export default function Documentation(){

    const [markdown, setMarkdown] = useState('# Hello Markdown!');

  return (
    <div>
     <Navbar title="Documentation"/>
     <Sidebar/>
    <div className="container py-4 doc-container">
      <div className="row">
        <div className="col-md-6 mb-3">
        <h3 className="mb-3 head">Markdown Editor</h3>
          <textarea
            className="form-control markdown-editor"
            rows="10"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="col-md-6">
          <h3 className="mb-3 head">Preview</h3>
          <div className="border p-3 bg-light rounded preview-container">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}