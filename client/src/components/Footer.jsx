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
          <Link to="/services">Szolgáltatások</Link>
          <Link to="/booking">Időpontfoglalás</Link>
          <Link to="/profile">Profilom</Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Elérhetőségek</h4>
          <p>📍<a href="https://www.google.com/maps/place/Kutyakozmetika+Vecs%C3%A9s/@47.407274,19.2646064,3a,75y,42.56h,83.7t/data=!3m7!1e1!3m5!1sVLzVyW2V-h1R654H0drfKw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D6.300827090968184%26panoid%3DVLzVyW2V-h1R654H0drfKw%26yaw%3D42.56203097200711!7i16384!8i8192!4m16!1m8!3m7!1s0x4741c02ec2f5b503:0xe5e8700a51694702!2zVmVjc8OpcywgTWlrbMOzcyB1LiA2LCAyMjIw!3b1!8m2!3d47.4074589!4d19.2646148!16s%2Fg%2F11fwhmj20s!3m6!1s0x4741c1d1198c74d1:0x4a540dff6d8c718f!8m2!3d47.4073916!4d19.2646542!10e5!16s%2Fg%2F11hdxbc6jw?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D" target='_blank'>Miklós utca 6.,<br></br> Vecsés, Magyarország, 2220</a></p>
          <p>📞 +36 (30) 723 5630</p>
          <p>🕐 Hétfő–Péntek: 8:00–18:00</p>
        </div>

        {/* Social */}
        <div className="footer-col">
          <h4>Közösségi média</h4>
          <a href="https://www.facebook.com/vecseskutyakozmetika" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://www.instagram.com/zsuzsannadnk" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@zsuzsannadnk" target="_blank" rel="noreferrer">TikTok</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kutyakozmetika Vecsés by Danok Zsuzsanna. Minden jog fenntartva.</p>
      </div>
    </footer>
  );
}

export default Footer;