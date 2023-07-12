import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'; // Import the CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/register">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
