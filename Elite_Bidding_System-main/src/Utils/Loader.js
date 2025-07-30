// Loader.js

import React from 'react';
import './Loader.css';

const Loader = ({ visible }) => {
    return visible ? (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader">
                    <div className="face face1"></div>
                    <div className="face face2"></div>
                    <div className="face face3"></div>
                    <div className="face face4"></div>
                    <div className="face face5"></div>
                    <div className="face face6"></div>
                </div>
            </div>
        </div>
    ) : null;
};

export default Loader;
