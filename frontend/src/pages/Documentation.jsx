import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { FaSave } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Documentation.css";

export default function Documentation() {
  const [markdown, setMarkdown] = useState(`### Inspiration
What is the inspiration of your project idea?
### Purpose
What is the purpose of your project?
### What it does
What does the project does?
### How we built it
WHat tech stack is used to built the project?`);

  const handleSave = () => {
    // Handle save logic here
    console.log("Markdown saved:", markdown);
  };

  return (
    <div>
      <Navbar title="Documentation" />
      <Sidebar />
      <div className="container py-4 doc-container">
        <div className="row">
          <div className="col-md-6 mb-3">
            <h3 className="mb-3 head">Markdown Editor</h3>
            <div className="position-relative mb-3">
            <TextareaAutosize
              className="form-control markdown-editor"
              minRows={10}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write here..."
            />
            <button
              className="position-absolute top-0 end-0 btn btn-sm btn-success btn-save-markdown"
              onClick={handleSave}
            >
              <FaRegBookmark />
            </button>
            </div>
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
