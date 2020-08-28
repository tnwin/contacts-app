import React from 'react';

const Footer = ({ text }) => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  };

  return (
    <div style={footerStyle}>
      <br />
      <em>{text}</em>
    </div>
  );
};

export default Footer;
