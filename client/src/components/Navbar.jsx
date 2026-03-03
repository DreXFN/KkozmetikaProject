import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpg';
import sunIcon from '../assets/light_mode.png';
import moonIcon from '../assets/dark_mode.png';


function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
      </div>

      <div className="navbar-links">
        <Link to="/">Főoldal</Link>
        <Link to="/services">Szolgáltatások</Link>
        <Link to="/booking">Időpontfoglalás</Link>
        <Link to="/profile">Profilom</Link>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
  <img
    src={theme === 'light' ? moonIcon : sunIcon}
    alt="toggle theme"
    width="30"
    height="30"
  />
</button>
      </div>
    </nav>
  );
}

export default Navbar;