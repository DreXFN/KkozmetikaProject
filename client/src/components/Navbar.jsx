import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpg';

function Navbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const lastScrollY              = useRef(0);
  const location                 = useLocation();
  const navigate = useNavigate();
  const handleNavClick = () => {
  setMenuOpen(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      setHidden(currentScrollY > lastScrollY.current && currentScrollY > 100);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'navbar-hidden' : ''}`}>
      <div className="navbar-left">
        <button className="hamburger" onClick={() => setMenuOpen(prev => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
  <div className="navbar-center">
    <div
            className="navbar-brand"
            onClick={() => {
            if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                navigate('/');
            }
            }}
          style={{ cursor: 'pointer' }}
        >
        <img src={logo} alt="logo" className="navbar-logo" />
        <span className="navbar-title">
          Kutyakozmetika Vecsés
        <small>by Danok Zsuzsanna</small>
      </span>
    </div>

  </div>
      
      </div>

      <div className="navbar-links">
        <Link to="/" onClick={handleNavClick} className={location.pathname === '/' ? 'nav-active' : ''}>Főoldal</Link>
        <Link to="/gallery" onClick={handleNavClick} className={location.pathname === '/gallery' ? 'nav-active' : ''}>Képgaléria</Link>
        <Link to="/contact" onClick={handleNavClick} className={location.pathname === '/contact' ? 'nav-active' : ''}>Kapcsolat</Link>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q10 0 20.5.67 10.5.66 24.17 2-37.67 31-59.17 77.83T444-660q0 90 63 153t153 63q53 0 99.67-20.5 46.66-20.5 77.66-56.17 1.34 12.34 2 21.84.67 9.5.67 18.83 0 150-105 255T480-120Zm0-66.67q102 0 179.33-61.16Q736.67-309 760.67-395.67q-23.34 9-49.11 13.67-25.78 4.67-51.56 4.67-117.46 0-200.06-82.61-82.61-82.6-82.61-200.06 0-22.67 4.34-47.67 4.33-25 14.66-55-91.33 28.67-150.5 107-59.16 78.34-59.16 175.67 0 122 85.66 207.67Q358-186.67 480-186.67Zm-6-288Z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"><path d="M574.33-385.67q39-39 39-94.33t-39-94.33q-39-39-94.33-39t-94.33 39q-39 39-39 94.33t39 94.33q39 39 94.33 39t94.33-39ZM338.5-338.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-446.67H40v-66.66h160v66.66Zm720 0H760v-66.66h160v66.66ZM446.67-760v-160h66.66v160h-66.66Zm0 720v-160h66.66v160h-66.66ZM260-655.33l-100.33-97 47.66-49 96 100-43.33 46Zm493.33 496-97.66-100.34 45-45.66 99.66 97.66-47 48.34Zm-98.66-541.34 97.66-99.66 49 47L702-656l-47.33-44.67ZM159.33-207.33 259-305l46.33 45.67-97.66 99.66-48.34-47.66ZM480-480Z"/></svg>
          )}
        </button>
      </div>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={handleNavClick}>Főoldal</Link>
          <Link to="/gallery" onClick={handleNavClick}>Képgaléria</Link>
          <Link to="/contact" onClick={handleNavClick}>Kapcsolat</Link>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
}

export default Navbar;