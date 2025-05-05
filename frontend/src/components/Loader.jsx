import React from "react";
import loader_boxes from "../assets/loader_boxes.webp";
import loader_spinner from "../assets/loader_spinner.gif";
import loader_hourglass from "../assets/loader_hourglass.gif";
import "./Loader.css";

export default function Loader({ message = "Loading...", type }) {
  return (
    <div className="loader-overlay">
      <div className="text-center my-4">
        {/* <Spinner animation='border' variant='light' role='status' /> */}
        {/* {!spinner && <img src="https://video-public.canva.com/VAEwnLy59fc/v/4b579cce86.gif" alt="loader" style={{width:'210px',height:'125px'}}/>}
            {spinner && <img src="https://video-public.canva.com/VADls74yFfs/videos/17d7b921cf.gif" alt="loader" style={{width:'120px',height:'120px'}}/>} */}
        {type === "boxes" && (
          <img
            src={loader_boxes}
            alt="loader"
            style={{ width: "180px", height: "100px" }}
          />
        )}
        {type === "spinner" && (
          <img
            src={loader_spinner}
            alt="loader"
            style={{ width: "120px", height: "120px" }}
          />
        )}
        {type === "hourglass" && (
          <img
            src={loader_hourglass}
            alt="loader"
            style={{ width: "120px", height: "120px" }}
          />
        )}
        <h3 className="mt-2 text-light">{message}</h3>
      </div>
    </div>
  );
}
