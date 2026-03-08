import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand */}
        <div className="footer-brand">
          <img src={logo} alt="logo" className="footer-logo" />
          <p className="footer-tagline">
            Szertettel várom a szépülni vágyó kutyusokat! 🐾
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <h4>Navigáció</h4>
          <Link to="/">Főoldal</Link>
          {/* <Link to="/services">Szolgáltatások</Link>
          <Link to="/booking">Időpontfoglalás</Link>
          <Link to="/profile">Profilom</Link> */}
          <Link to="/gallery">Képgaléria</Link>

          <Link to="/contact">Kapcsolat</Link>

        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Elérhetőségek</h4>
          <p>📍<a href="https://maps.app.goo.gl/kz4H2HX7g8h3PYTg6" target='_blank'>Miklós utca 6., Vecsés, 2220</a></p>
          <p>📞 <a href="tel:+36307235630">+36 30 723 5630</a></p>
          <p>🕐 Telefonos időpont egyeztetéssel, rugalmas időbeosztásban. </p>
        </div>

        {/* Social */}
        <div className="footer-col">
          <h4>Közösségi média</h4>
          <a href="https://www.facebook.com/vecseskutyakozmetika" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com/kutyakozmetika_vecses/" target="_blank" rel="noreferrer">Instagram</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kutyakozmetika Vecsés by Danok Zsuzsanna.<br></br> Minden jog fenntartva.</p>
      </div>
    </footer>
  );
}

export default Footer;