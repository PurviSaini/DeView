import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loader({message = "Loading..."}){
    return (
        <div className="text-center my-4">
            <Spinner animation='border' variant='light' role='status' />
            <div className="mt-2 text-light">{message}</div>
        </div>
    );
}