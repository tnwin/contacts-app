import React from 'react';

// Reusable button component with optional props
const Button = ({ type, onClick, text }) => (
  <button type={type} onClick={onClick}>
    {text}
  </button>
);

export default Button;
