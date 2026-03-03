import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/services')
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load services');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Kkozmetika</h1>
      <p></p>

      <h2>Szolgáltatások</h2>

      {loading && <p>Loading...</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}

      {services.map(service => (
        <div key={service.id} style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          maxWidth: '400px'
        }}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
         <p><strong>{parseFloat(service.price).toLocaleString('hu-HU')} Ft</strong> · {service.duration_min} perc</p>
        </div>
      ))}
    </div>
  );
}

export default Home;