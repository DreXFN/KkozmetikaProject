import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api.js';
import './Profile.css';


function Profile() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');


  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState(
  localStorage.getItem('profileTab') || 'info'
    );
      const changeTab = (tab) => {
  localStorage.setItem('profileTab', tab);
  setActiveTab(tab);
    };
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState(null);
  const [error, setError]         = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
   const [dogs, setDogs]               = useState([]);
  const [dogsLoading, setDogsLoading] = useState(false);
  const [showDogForm, setShowDogForm] = useState(false);
  const [editingDog, setEditingDog]   = useState(null);

  const emptyDog = {
    name: '', breed: '', date_of_birth: '', coat_type: '',
    weight_kg: '', allergies: '', medical_notes: '', behaviour_notes: ''
  };
  const [dogForm, setDogForm] = useState(emptyDog);
  
  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        setForm({
          first_name: res.data.first_name,
          last_name:  res.data.last_name,
          phone:      res.data.phone || ''
        });
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      });
  }, []);
   useEffect(() => {
    if (activeTab === 'dogs') fetchDogs();
  }, [activeTab]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const showMessage = (msg, isError = false) => {
    if (isError) setError(msg);
    else setMessage(msg);
    setTimeout(() => { setMessage(null); setError(null); }, 3000);
  };

  const saveInfo = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/api/auth/update`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, ...res.data });
      localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
      showMessage('Profile updated successfully!');
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to update.', true);
    }
    setSaving(false);
  };

  const savePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      showMessage('New passwords do not match.', true);
      return;
    }
    if (passwords.new_password.length < 6) {
      showMessage('Password must be at least 6 characters.', true);
      return;
    }
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/auth/password`, {
        current_password: passwords.current_password,
        new_password: passwords.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      showMessage('Password changed successfully!');
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to change password.', true);
    }
    setSaving(false);
  };

  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profileTab');
      navigate('/');
      window.location.reload();
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/auth/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      showMessage('Failed to delete account.', true);
    }
  };
  const fetchDogs = async () => {
    setDogsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/dogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDogs(res.data);
    } catch (err) {
      showMessage('Could not load dogs.', true);
    }
    setDogsLoading(false);
  };

  const handleDogChange = (e) => {
    setDogForm({ ...dogForm, [e.target.name]: e.target.value });
  };

  const openAddDog = () => {
    setDogForm(emptyDog);
    setEditingDog(null);
    setShowDogForm(true);
  };

  const openEditDog = (dog) => {
    setDogForm({
      name:            dog.name || '',
      breed:           dog.breed || '',
      date_of_birth:   dog.date_of_birth ? dog.date_of_birth.split('T')[0] : '',
      coat_type:       dog.coat_type || '',
      weight_kg:       dog.weight_kg || '',
      allergies:       dog.allergies || '',
      medical_notes:   dog.medical_notes || '',
      behaviour_notes: dog.behaviour_notes || ''
    });
    setEditingDog(dog);
    setShowDogForm(true);
  };

  const saveDog = async () => {
    if (!dogForm.name) { showMessage('Kutyus neve kötelező!', true); return; }
    setSaving(true);
    try {
      if (editingDog) {
        await axios.put(`${API_URL}/api/dogs/${editingDog.id}`, dogForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage('Dog updated!');
      } else {
        await axios.post(`${API_URL}/api/dogs`, dogForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showMessage('Dog added!');
      }
      setShowDogForm(false);
      fetchDogs();
    } catch (err) {
      showMessage('Failed to save dog.', true);
    }
    setSaving(false);
  };

  const deleteDog = async (id) => {
    if (!window.confirm('Remove this dog from your profile?')) return;
    try {
      await axios.delete(`${API_URL}/api/dogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('Dog removed.');
      fetchDogs();
    } catch (err) {
      showMessage('Failed to remove dog.', true);
    }
  };

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="profile-page">

      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          {user.last_name?.[0]}{user.first_name?.[0]}
        </div>
        <div className="profile-name">{user.last_name} {user.first_name}</div>
        <div className="profile-email">{user.email}</div>
        <div className="profile-badge">{user.role}</div>

        <nav className="profile-nav">
          <button
            className={activeTab === 'info' ? 'active' : ''}
            onClick={() => changeTab('info')}
          >
            👤 Profil információk
          </button>
           <button className={activeTab === 'dogs'     ? 'active' : ''} onClick={() => changeTab('dogs')}>
            🐕 Kutyusaim
          </button>
          <button
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => changeTab('password')}
          >
            🔐 Jelszó változtatás
          </button>
          <button
            className={activeTab === 'danger' ? 'active' : ''}
            onClick={() => changeTab('danger')}
          >
            ⚠️ Profil törlése
          </button>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Kijelentkezés
        </button>
      </aside>

      {/* Main content */}
      <main className="profile-main">

        {/* Messages */}
        {message && <div className="profile-success">{message}</div>}
        {error   && <div className="profile-error">{error}</div>}

        {/* Personal Info */}
        {activeTab === 'info' && (
          <div className="profile-section">
            <h2>Személyes információk</h2>
            <p className="section-sub">Megváltoztathatod személyes információidat és elérhetőségedet</p>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Vezetéknév</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label>Keresztnév</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                />
                <span className="field-note">E-mail cím nem változtatható meg</span>
              </div>

              <div className="form-field">
                <label>Telefonszám</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+36 XX XXX XXXX"
                />
              </div>

              <div className="form-field">
                <label>Regisztráció dátuma</label>
                <input
                  type="text"
                  value={new Date(user.created_at).toLocaleDateString('hu-HU')}
                  disabled
                />
              </div>

              <button
                className="save-btn"
                onClick={saveInfo}
                disabled={saving}
              >
                {saving ? 'Mentés...' : 'Változtatások mentése'}
              </button>
            </div>
          </div>
        )}
        {activeTab === 'dogs' && (
          <div className="profile-section">
            <div className="dogs-header">
              <div>
                <h2>Kedvenceim</h2>
                <p className="section-sub">Kezeld kedvenceid profilját!</p>
              </div>
              <button className="save-btn" onClick={openAddDog}>+ Hozzáadás</button>
            </div>

            {showDogForm && (
              <div className="dog-form-card">
                <h3>{editingDog ? 'Módósítás' : 'Kutyus hozzáadás'}</h3>
                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label>Név <span style={{color:'var(--accent)'}}>*</span></label>
                      <input name="name" value={dogForm.name} onChange={handleDogChange} placeholder="Mázli" />
                    </div>
                    <div className="form-field">
                      <label>Fajta</label>
                      <input name="breed" value={dogForm.breed} onChange={handleDogChange} placeholder="Golden Retriever" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Születési dátum</label>
                       <input 
                            type="date"
                            name="date_of_birth"
                            value={dogForm.date_of_birth}
                            onChange={handleDogChange}
                            max={new Date().toISOString().split('T')[0]}
                          />
                    </div>
                    <div className="form-field">
                      <label>Súly (kg)</label>
                      <input type="number" name="weight_kg" min={0} value={dogForm.weight_kg} onChange={handleDogChange} placeholder="4" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Szőr típus</label>
                    <select name="coat_type" value={dogForm.coat_type} onChange={handleDogChange}>
                      <option value="">Válassz szőr típust</option>
                      <option value="rövid">Rövid</option>
                      <option value="közepes">Közepes</option>
                      <option value="hosszú">Hosszú</option>
                      <option value="göndör">Göndör</option>
                      
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Allergiák</label>
                    <input name="allergies" value={dogForm.allergies} onChange={handleDogChange} placeholder=" levendula, zab" />
                  </div>
                  <div className="form-field">
                    <label>Egyéb betegségek/kondíciók</label>
                    <textarea name="medical_notes" value={dogForm.medical_notes} onChange={handleDogChange} placeholder="..." rows={2} />
                  </div>
                  <div className="form-field">
                    <label>Viselkedés megjegyzés</label>
                    <textarea name="behaviour_notes" value={dogForm.behaviour_notes} onChange={handleDogChange} placeholder="félős..." rows={2} />
                  </div>
                  <div className="dog-form-actions">
                    <button className="save-btn" onClick={saveDog} disabled={saving}>
                      {saving ? 'Saving...' : editingDog ? 'Mentés' : 'Mentés'}
                    </button>
                    <button className="cancel-btn" onClick={() => setShowDogForm(false)}>Mégse</button>
                  </div>
                </div>
              </div>
            )}

            {dogsLoading && <div className="profile-loading"><div className="spinner"></div></div>}

            {!dogsLoading && dogs.length === 0 && !showDogForm && (
              <div className="dogs-empty">
                <span>🐾</span>
                <p>Még nem adtad hozzá kutyusodat. Kattínts a <strong>+ hozzáadás</strong> gombra és kezdheted!</p>
              </div>
            )}

            <div className="dogs-grid">
              {dogs.map(dog => (
                <div key={dog.id} className="dog-card">
                  <div className="dog-card-avatar">🐕</div>
                  <div className="dog-card-info">
                    <h3>{dog.name}</h3>
                    {dog.breed && <p className="dog-breed">{dog.breed}</p>}
                    <div className="dog-tags">
                      {dog.coat_type  && <span className="dog-tag">{dog.coat_type} szőrű</span>}
                      {dog.weight_kg  && <span className="dog-tag">{dog.weight_kg} kg</span>}
                      {dog.date_of_birth && (
                        <span className="dog-tag">
                          {Math.floor((new Date() - new Date(dog.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))} éves
                        </span>
                      )}
                    </div>
                    {dog.allergies && <p className="dog-allergy">⚠️ {dog.allergies}</p>}
                  </div>
                  <div className="dog-card-actions">
                    <button className="dog-edit-btn" onClick={() => openEditDog(dog)}>Modosítás</button>
                    <button className="dog-delete-btn" onClick={() => deleteDog(dog.id)}>Törlés</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Change Password */}
        {activeTab === 'password' && (
          <div className="profile-section">
            <h2>Jelszó megváltoztatása</h2>
            <p className="section-sub">Győződj meg róla, hogy a jelszavad erős és egyedi!</p>

            <div className="profile-form">
              <div className="form-field">
                <label>Jelenlegi jelszó</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-field">
                <label>Új jelszó</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-field">
                <label>Új jelszó jóváhagyása</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

              <button
                className="save-btn"
                onClick={savePassword}
                disabled={saving}
              >
                {saving ? 'Mentés...' : 'Jelszó megváltoztatása'}
              </button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        {activeTab === 'danger' && (
          <div className="profile-section">
            <h2>Profil törlése</h2>
            <p className="section-sub">A törlés végleges és nem visszavonható</p>

            <div className="danger-card">
              <div>
                <h4>Profil végleges törlése</h4>
                <p>Profil és azzal kapcsolatos adatok végleges törlése</p>
              </div>
              <button className="delete-btn" onClick={deleteAccount}>
                Profil törlése
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
  
}

export default Profile;