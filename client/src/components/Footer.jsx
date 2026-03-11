import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Footer.css';

function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <footer className="footer">
      
      <div className="footer-content">
        {/* Navigation */}
            <div className="footer-col">
          <h4>Navigáció</h4>
          <Link to="/" onClick={scrollTop}>Főoldal</Link>
          {/* <Link to="/services">Szolgáltatások</Link>
          <Link to="/booking">Időpontfoglalás</Link>
          <Link to="/profile">Profilom</Link> */}
          <Link to="/gallery" onClick={scrollTop}>Képgaléria</Link>

          <Link to="/contact" onClick={scrollTop}>Kapcsolat</Link>

        </div>
       

        {/* Contact */}
        <div className="footer-contact-center">
          <p className="footer-phone"><a href='tel:+36307235630'>Tel. 06-30-723-5630</a></p>
          <a
            className="footer-address"
            href="https://maps.app.goo.gl/kz4H2HX7g8h3PYTg6"
            target="_blank"
            rel="noreferrer"
          >
            2220 Vecsés Miklós utca 6.
          </a>
          <p className="footer-sub">Piactér mellet, Vecsés központjában.</p>
        </div>
        {/* Social */}
        <div className="footer-col">
          <h4>Közösségi média</h4>
          <a href="https://www.facebook.com/vecseskutyakozmetika" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com/kutyakozmetika_vecses/" target="_blank" rel="noreferrer">Instagram</a>
        </div>

      </div>
      <div className="footer-version">v1.2.2 | Made by <a id='creator' href='https://github.com/DreXFN/KkozmetikaProject'>Danok Károly</a> </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kutyakozmetika Vecsés by Danok Zsuzsanna.<br></br> Minden jog fenntartva.</p>
      </div>
    </footer>
  );
}

export default Footer;