import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loader({message = "Loading..."}){
    return (
        <div className="text-center my-4">
            {/* <Spinner animation='border' variant='light' role='status' /> */}
            <img src="https://video-public.canva.com/VAEwnLy59fc/v/4b579cce86.gif" alt="loader" style={{width:'210px',height:'125px'}}/>
            {/* <img src="https://video-public.canva.com/VADls74yFfs/videos/17d7b921cf.gif" alt="loader" style={{width:'120px',height:'120px'}}/> */}
            <h3 className="mt-2 text-light">{message}</h3>
        </div>
    );
}