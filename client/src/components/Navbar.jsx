import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpg';
import sunIcon from '../assets/light_mode.png';
import moonIcon from '../assets/dark_mode.png';


function Navbar({ theme, toggleTheme }) {
   const [menuOpen, setMenuOpen] = useState(false);

  return (
    
    <nav className="navbar">
      <div className="navbar-left">
          <button
            className="hamburger"
            onClick={() => setMenuOpen(prev => !prev)}
            >
            <span></span>
            <span></span>
            <span></span>
          </button>
         <Link to="/">
              <img src={logo} alt="logo" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Főoldal</Link>
        <Link to="/services">Szolgáltatások</Link>
        <Link to="/booking">Időpontfoglalás</Link>
        <Link to="/profile">Profilom</Link>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
              <img src={theme === 'light' ? moonIcon : sunIcon} alt="toggle theme" width="30" height="30"/>
        </button>
      </div>
          <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
            <Link to="/"        onClick={() => setMenuOpen(false)}>Főoldal</Link>
            <Link to="/services" onClick={() => setMenuOpen(false)}>Szolgáltatások</Link>
            <Link to="/booking"  onClick={() => setMenuOpen(false)}>Időpontfoglalás</Link>
            <Link to="/profile"  onClick={() => setMenuOpen(false)}>Profilom</Link>
          </div>
           {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    
    </nav>
    
    
  );
}

export default Navbar;