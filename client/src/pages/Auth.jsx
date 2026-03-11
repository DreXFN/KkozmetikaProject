import { useState } from 'react';
import axios from 'axios';
import API_URL from '../api.js';
import './Auth.css';


function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!form.email || !form.password) {
      setError('Minden kötelező mezőt tölts ki!');
      setLoading(false);
      return;
    }

    if (!isLogin && form.password !== form.confirm_password) {
      setError('A jelszavak nem egyeznek!');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: form.email,
          password: form.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/';
      } else {
        await axios.post(`${API_URL}/api/auth/register`, {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          password: form.password
        });
        setSuccess('Profil lérehozva! Mostmár bejelentkezhetsz.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Valami hiba történt.');
    }

    setLoading(false);
  };

  return (
    
    <div className="auth-page">

      <div className="auth-card">

        {/* Toggle */}
        <div className="auth-toggle">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
          >
            Bejelentkezés
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
          >
            Regisztráció
          </button>
        </div>

        <h2>{isLogin ? 'Üdvözlünk! 🐾' : 'Fiók létrehozása'}</h2>
        <p className="auth-sub">
          {isLogin
            ? 'Jelentkezz be az időpontfoglaláshoz!'
            : 'Regisztrálj hogy időpontot foglalhass és/vagy menedzseld kutyusaidat!'}
        </p>

        
        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        
        <div className="auth-form">

          {/* Register only fields */}
          {!isLogin && (
            <>
              <div className="auth-row">
                <div className="auth-field">
                  <label>Vezetéknév</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Szabó"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>
                  <div className="auth-field">
                  <label>Keresztnév</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Áron"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="auth-field">
                <label>Telefonszám</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+36 XX XXX XXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Shared fields */}
          <div className="auth-field">
            <label>Email <span>*</span></label>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label> Jelszó <span>*</span></label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label>Jelszó jóváhagyása<span>*</span></label>
              <input
                type="password"
                name="confirm_password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
              />
            </div>
          )}

          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Kérlek várj...' : isLogin ? 'Bejelentkezés' : 'Fiók létrehozása'}
          </button>

        </div>

        <p className="auth-switch">
          {isLogin ? "Még nincs fiókod? " : 'Már van fiókod? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}>
            {isLogin ? 'Regisztrálás' : 'Bejelentkezés'}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Auth;