import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Booking.css';


const HOURS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30'
];

function Booking() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem('token');
  const [fullyBookedDates, setFullyBookedDates] = useState([]);

  // Pre-selected service passed from Services page
  const preSelected = location.state?.service || null;

  const [step, setStep]           = useState(1);
  const [services, setServices]   = useState([]);
  const [dogs, setDogs]           = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);

  const [form, setForm] = useState({
    service_id:     preSelected?.id     || '',
    service_name:   preSelected?.name   || '',
    service_duration: preSelected?.duration_min || '',
    dog_id:         '',
    dog_name:       '',
    date:           '',
    time:           '',
    customer_notes: ''
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login');
  }, []);

  // Fetch services and dogs
  useEffect(() => {
    axios.get(`${API_URL}/api/services`)
      .then(res => setServices(res.data));

    axios.get(`${API_URL}/api/dogs`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setDogs(res.data));
  }, []);

  // Fetch booked slots when date changes
useEffect(() => {
  axios.get(`${API_URL}/api/services`)
    .then(res => setServices(res.data));

  axios.get(`${API_URL}/api/dogs`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setDogs(res.data));

  
}, []);
useEffect(() => {
  if (!form.date) return;
  axios.get(`${API_URL}/api/appointments/slots?date=${form.date}&duration=${form.service_duration || 30}`)
    .then(res => setBookedSlots(res.data));
}, [form.date, form.service_duration]);

  const selectService = (service) => {
    setForm({ ...form, service_id: service.id, service_name: service.name, service_duration: service.duration_min});
    setStep(2);
  };

  const selectDog = (dog) => {
    setForm({ ...form, dog_id: dog.id, dog_name: dog.name });
    setStep(3);
  };

  const selectTime = (time) => {
    setForm({ ...form, time });
    setStep(4);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const confirm = async () => {
    setSaving(true);
    setError(null);
    try {
      const scheduled_at = `${form.date}T${form.time}:00`;
      await axios.post(`${API_URL}/api/appointments`, {
        dog_id:         form.dog_id,
        service_id:     form.service_id,
        scheduled_at,
        customer_notes: form.customer_notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment.');
    }
    setSaving(false);
  };

  if (success) return (
    <div className="booking-page">
      <div className="booking-success">
        <div className="success-icon">🐾</div>
        <h2>Időpont lefoglalva!</h2>
        <p>Sok szeretettel várom <strong>{form.dog_name}</strong>-t <strong>{form.date}</strong> ,<strong>{form.time}</strong>-kor <strong>{form.service_name}</strong>-ra.</p>
        <button className="book-confirm-btn" onClick={() => navigate('/profile')}>
          Időpontjaim
        </button>
        <button className="book-back-link" onClick={() => { setSuccess(false); setStep(1); setForm({ ...form, date: '', time: '', customer_notes: '' }); }}>
          Másik időpont foglalása
        </button>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="booking-card">

        <h1>Időpontfoglalás</h1>

        {/* Progress bar */}
        <div className="booking-steps">
          {['Szolgáltatás', 'Kiskedvenc', 'Dátum', 'Áttekintés'].map((label, i) => (
            <div key={i} className={`booking-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {error && <div className="booking-error">{error}</div>}

        {/* ── STEP 1: Service ── */}
        {step === 1 && (
          <div className="booking-section">
            <h2>Szolgáltatás kiválasztása</h2>
            <div className="booking-services">
              {services.map(s => (
                <div
                  key={s.id}
                  className={`booking-service-card ${form.service_id === s.id ? 'selected' : ''}`}
                  onClick={() => selectService(s)}
                >
                  <div className="bsc-name">{s.name}</div>
                  <div className="bsc-meta">
                    <span>{parseInt(s.price).toLocaleString('hu-HU')} Ft</span>
                    <span>{s.duration_min} perc</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Dog ── */}
        {step === 2 && (
          <div className="booking-section">
            <h2>Válaszd ki kutyusodat</h2>
            {dogs.length === 0 ? (
              <div className="booking-empty">
                <p>You have no dogs added yet.</p>
                <button className="book-confirm-btn" onClick={() => navigate('/profile')}>
                  Add a Dog First
                </button>
              </div>
            ) : (
              <div className="booking-dogs">
                {dogs.map(dog => (
                  <div
                    key={dog.id}
                    className={`booking-dog-card ${form.dog_id === dog.id ? 'selected' : ''}`}
                    onClick={() => selectDog(dog)}
                  >
                    <span className="bdc-icon">🐕</span>
                    <div>
                      <div className="bdc-name">{dog.name}</div>
                      {dog.breed && <div className="bdc-breed">{dog.breed}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="book-back-btn" onClick={() => setStep(1)}>← Vissza</button>
          </div>
        )}

        {/* ── STEP 3: Date & Time ── */}
        {step === 3 && (
  <div className="booking-section">
    <h2>Válassz napot & órát </h2>

    <label className="time-label">Válassz dátumot!</label>
    <Calendar
  onChange={(date) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    setForm({ ...form, date: formatted, time: '' });
  }}
  value={form.date ? new Date(form.date + 'T12:00:00') : null}
  minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
  tileClassName={({ date }) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    return fullyBookedDates.includes(formatted) ? 'fully-booked' : null;
  }}
  tileDisabled={({ date }) => date.getDay() === 0}
/>

    {form.date && (
      <>
        <label className="time-label" style={{ marginTop: '1.5rem' }}>
          Választható időpontok {form.date}. - én
        </label>
        <div className="time-grid">
          {HOURS.map(hour => {
            const isBooked = bookedSlots.includes(hour);
             console.log(`${hour} isBooked:`, isBooked, 'bookedSlots:', bookedSlots);
            return (
              <button
                key={hour}
                className={`time-slot
                  ${isBooked ? 'booked' : ''}
                  ${form.time === hour ? 'selected' : ''}
                `}
                disabled={isBooked}
                onClick={() => selectTime(hour)}
              >
                {hour}
              </button>
            );
          })}
        </div>
      </>
    )}

    <button className="book-back-btn" onClick={() => setStep(2)}>← Vissza</button>
  </div>
    )}

        {/* ── STEP 4: Confirm ── */}
        {step === 4 && (
          <div className="booking-section">
            <h2>Áttekintés</h2>

            <div className="booking-summary">
              <div className="summary-row">
                <span>Szolgáltatás</span>
                <strong>{form.service_name}</strong>
              </div>
              <div className="summary-row">
                <span>Kutyus</span>
                <strong>{form.dog_name}</strong>
              </div>
              <div className="summary-row">
                <span>Dátum</span>
                <strong>{form.date}</strong>
              </div>
              <div className="summary-row">
                <span>Idő</span>
                <strong>{form.time}</strong>
              </div>
              <div className="summary-row">
                <span>Időtartam</span>
                <strong>{form.service_duration} perc</strong>
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '1rem' }}>
              <label>Megjegyzés (opcionális)</label>
              <textarea
                rows={3}
                
                value={form.customer_notes}
                onChange={e => setForm({ ...form, customer_notes: e.target.value })}
              />
            </div>

            <div className="booking-actions">
              <button className="book-confirm-btn" onClick={confirm} disabled={saving}>
                {saving ? 'Booking...' : 'Jóváhagyás'}
              </button>
              <button className="book-back-btn" onClick={() => setStep(3)}>← Vissza</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Booking;