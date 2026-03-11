import './Contact.css';
import heroImage from '../assets/hero-crop.webp';

function Contact() {
  return (
    <div className="contact-page">

              <div className="page-hero">
        <img src={heroImage} alt="hero" />
        <div className="page-hero-overlay">
          <h1>Kapcsolat</h1>
          <p>Örömmel várom kedvenceidet!</p>
        </div>
      </div>

      <div className="contact-content">

        {/* Info Cards */}
        <div className="contact-info">

          <div className="info-card">
            <div className="info-icon">📍</div>
            <div>
              <h3>Cím</h3>
              <p>2220 Vecsés,<br />Miklós utca 6</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <div>
              <h3>Telefon</h3>
              <a href="tel:+36307235630">+36 30 723 5630</a>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon">🕐</div>
            <div>
              <h3>Nyitvatartás</h3>
              <table className="hours-table">
                <tbody>
                  <tr><td>Telefonos időpont egyeztetéssel, rugalmas időbeosztásban.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📱</div>
            <div>
              <h3>Kövess!</h3>
              <div className="social-links">
                <a href="https://www.facebook.com/vecseskutyakozmetika" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://www.instagram.com/kutyakozmetika_vecses/" target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>
          </div>

        </div>

        {/* Map */}
        <div className="contact-map">
          <iframe
            title="Térkép"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d337.52891856714535!2d19.264762321498512!3d47.40742849428296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c1d1198c74d1%3A0x4a540dff6d8c718f!2sKutyakozmetika%20Vecs%C3%A9s!5e0!3m2!1shu!2shu!4v1772896712976!5m2!1shu!2shu"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </div>
  );
}

export default Contact;