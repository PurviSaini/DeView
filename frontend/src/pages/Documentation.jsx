import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect,useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import ReactMarkdown from "react-markdown";
import TextareaAutosize from "react-textarea-autosize";
import { FaSave } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Documentation.css";
import axios from "axios";

export default function Documentation() {
   const { isCollapsed } = useContext(SidebarContext);
  const [markdown, setMarkdown] = useState(`## Inspiration
What inspired you to build this project?
## What it does?
Define the features of the project.
## How we built it?
What are the technologies used to build the project?
## Challenges we ran into
Define the challenges you faced while building the project.
## Accomplishments that we're proud of
Define the accomplishments you achieved while building the project.
## What we learned
Define the learnings you had while building the project.
## What's next for this project?
Define the future scope of the project.`);

  const handleSave = async () => {
    //Save the project description to database
    try{
      const data = {
        projectDesc: markdown,
      };
      await axios.post(import.meta.env.VITE_BACKEND_URL+"/documentation", data,{
        withCredentials: true,
      });
      alert("Project description saved successfully")
    }catch(err){
      console.log(err);
    }
  };

  useEffect(() => {
    // Fetch the content from the database when the component mounts
    const fetchProjectDesc = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL+"/documentation",{
          withCredentials: true,
        });
        if (response.data && response.data.projectDesc) {
          setMarkdown(response.data.projectDesc);
        }
      } catch (error) {
        console.error("Error fetching markdown:", error);
      }
    };

    fetchProjectDesc();
  }, []);

  return (
    <div>
      <Navbar title="Documentation" />
      <Sidebar />
      <div className={`container py-4 doc-container ${isCollapsed ? "collapsed" : ""}`}>
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
