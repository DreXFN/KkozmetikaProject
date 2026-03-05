import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">

      <div className="contact-hero">
        <h1>Kapcsolat</h1>
        <p>Örömmel várom kedvenceidet!</p>
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
              <a href="tel:+36301234567">+36 30 123 4567</a>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <div>
              <h3>Email</h3>
              <a href="mailto:hello@kkozmetika.hu">hello@kkozmetika.hu</a>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🕐</div>
            <div>
              <h3>Nyitvatartás</h3>
              <table className="hours-table">
                <tbody>
                  <tr><td>Hétfő – Szombat</td><td>8:00 – 19:00</td></tr>
                  <tr><td>Vasárnap</td><td>Zárva</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📱</div>
            <div>
              <h3>Kövess minket</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
              </div>
            </div>
          </div>

        </div>

        {/* Map */}
        <div className="contact-map">
          <iframe
            title="Térkép"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2700.2296051605585!2d19.26203987683558!3d47.407462501707094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c02ec2f5b503%3A0xe5e8700a51694702!2zVmVjc8OpcywgTWlrbMOzcyB1LiA2LCAyMjIw!5e0!3m2!1shu!2shu!4v1772728225913!5m2!1shu!2shu"
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