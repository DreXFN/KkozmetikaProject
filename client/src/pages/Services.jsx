import { useEffect, useState } from 'react';
import axios from 'axios';
import './Services.css';
import API_URL from '../api.js';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/services`)
    .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load services');
        setLoading(false);
      });
  }, []);


  const icons = {
    'Full Groom':         '✂️',
    'Bath & Brush':       '🛁',
    'Nail Trim':          '💅',
    'Ear Cleaning':       '🐾',
    'Teeth Brushing':     '🦷',
    'Puppy First Groom':  '🐶',
  };

  return (
    <div className="services-page">

      <div className="services-hero">
        <h1>Szolgáltatások</h1>
        <p></p>
      </div>

      {loading && (
        <div className="services-loading">
          <div className="spinner"></div>
          <p>Szolgáltatások betöltése...</p>
        </div>
      )}

      {error && (
        <div className="services-error">{error}</div>
      )}

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">
              {icons[service.name] || '🐾'}
            </div>
            <div className="service-info">
              <h2>{service.name}</h2>
              <p className="service-desc">{service.description}</p>
              <div className="service-meta">
                <span className="service-price">
                  {parseInt(service.price).toLocaleString('hu-HU')} Ft
                </span>
                <span className="service-duration">
                  🕐 {service.duration_min} perc
                </span>
              </div>
              <button className="book-btn">Időpontfoglalás</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Services;