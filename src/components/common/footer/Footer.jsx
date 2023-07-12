import React from 'react';
import './footer.css'; // Import the CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Cars Management System</p>
    </footer>
  );
};

export default Footer;
