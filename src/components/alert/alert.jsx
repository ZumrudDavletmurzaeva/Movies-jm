/* eslint-disable arrow-body-style */
import React from 'react';
import './alert.css';

const Alert = () => {
  return (
    <div className="error-indicator">
      <h4 className="boom">ERROR</h4>
      <span>Something has gone terribly wrong!</span>
    </div>
  );
};

export default Alert;
