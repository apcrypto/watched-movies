import React from 'react';

export const ErrorMessage = ({ message }) => {
  return (
    <div className="error">
      <span> ⛔ </span>
      {message}
    </div>
  );
};
