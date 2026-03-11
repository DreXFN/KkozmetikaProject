const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://192.168.1.4:5173' }));
app.use(express.json());

// Test DB — fetch all services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE is_active = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Register
app.post('/api/auth/register', async (req, res) => {
  const { first_name, last_name, email, phone, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Ezzel az e-mail címmel már létezik fiók.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone, password_hash) VALUES ($1,$2,$3,$4,$5)',
      [first_name, last_name, email, phone, hash]
    );
    res.json({ message: 'Fiók sikeresen létrehozva.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Hibás e-mail cím vagy jelszó.' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Hibás e-mail cím vagy jelszó.' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader); // ← add this

  const token = authHeader?.split(' ')[1];
  console.log('Token received:', token);   // ← and this

  if (!token) return res.status(401).json({ error: 'Not authorized.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);      // ← and this
    req.user = decoded;
    next();
  } catch (err) {
    console.log('JWT error:', err.message); // ← and this
    res.status(401).json({ error: 'Invalid token.' });
  }
};


// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, phone, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
app.put('/api/auth/update', authMiddleware, async (req, res) => {
  const { first_name, last_name, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET first_name=$1, last_name=$2, phone=$3 WHERE id=$4 RETURNING id, first_name, last_name, email, phone',
      [first_name, last_name, phone, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change password
app.put('/api/auth/password', authMiddleware, async (req, res) => {
  const { current_password, new_password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    const match = await bcrypt.compare(current_password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Current password is incorrect.' });
    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, req.user.id]);
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete account
app.delete('/api/auth/delete', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.json({ message: 'Account deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all dogs for logged in user
app.get('/api/dogs', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM dogs WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a dog
app.post('/api/dogs', authMiddleware, async (req, res) => {
  const { name, breed, date_of_birth, coat_type, weight_kg, allergies, medical_notes, behaviour_notes } = req.body;
  console.log('Adding dog:', req.body);      // ← add this
  console.log('User ID:', req.user.id);      // ← add this
  try {
    const result = await pool.query(
      `INSERT INTO dogs (user_id, name, breed, date_of_birth, coat_type, weight_kg, allergies, medical_notes, behaviour_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, name, breed, date_of_birth || null, coat_type || null, weight_kg || null, allergies, medical_notes, behaviour_notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log('Dog insert error:', err.message); // ← add this
    res.status(500).json({ error: err.message });
  }
});

// Update a dog
app.put('/api/dogs/:id', authMiddleware, async (req, res) => {
  const { name, breed, date_of_birth, coat_type, weight_kg, allergies, medical_notes, behaviour_notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE dogs SET name=$1, breed=$2, date_of_birth=$3, coat_type=$4, weight_kg=$5,
       allergies=$6, medical_notes=$7, behaviour_notes=$8
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [name, breed, date_of_birth || null, coat_type || null, weight_kg || null, allergies, medical_notes, behaviour_notes, req.params.id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a dog (soft delete)
app.delete('/api/dogs/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE dogs SET is_active = false WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Dog removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get booked slots for a specific date
app.get('/api/appointments/slots', async (req, res) => {
  const { date, duration = 30 } = req.query;
  try {
    const result = await pool.query(
      `SELECT 
        to_char(scheduled_at AT TIME ZONE 'Europe/Budapest', 'HH24:MI') as time,
        s.duration_min
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE DATE(scheduled_at AT TIME ZONE 'Europe/Budapest') = $1 
       AND a.status IN ('függőben', 'jóváhagyva')`,
      [date]
    );

    const blockedSlots = new Set();

    result.rows.forEach(({ time, duration_min }) => {
      const [hours, minutes] = time.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;

      // Block slots occupied by this appointment
      const slotsBlocked = Math.ceil(duration_min / 30);
      for (let i = 0; i < slotsBlocked; i++) {
        const blockedMinutes = startMinutes + (i * 30);
        const h = String(Math.floor(blockedMinutes / 60)).padStart(2, '0');
        const m = String(blockedMinutes % 60).padStart(2, '0');
        blockedSlots.add(`${h}:${m}`);
      }

      // Block slots that would overlap INTO this appointment
      const newDurationSlots = Math.ceil(parseInt(duration) / 30);
      for (let i = 1; i < newDurationSlots; i++) {
        const blockedMinutes = startMinutes - (i * 30);
        if (blockedMinutes >= 0) {
          const h = String(Math.floor(blockedMinutes / 60)).padStart(2, '0');
          const m = String(blockedMinutes % 60).padStart(2, '0');
          blockedSlots.add(`${h}:${m}`);
        }
      }
    });

    res.json([...blockedSlots]);
  } catch (err) {
    console.log('Slots error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
// Create appointment
app.post('/api/appointments', authMiddleware, async (req, res) => {
  const { dog_id, service_id, scheduled_at, customer_notes } = req.body;
  try {
    // Get duration of the service being booked
    const service = await pool.query('SELECT price, duration_min FROM services WHERE id = $1', [service_id]);
    const duration = service.rows[0].duration_min;

    // Check if any existing appointment overlaps with the new one
    const conflict = await pool.query(
      `SELECT a.id FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.status IN ('függőben', 'jóváhagyva')
       AND (
         -- New appointment starts during an existing one
         ($1::timestamptz >= a.scheduled_at AND $1::timestamptz < a.scheduled_at + (s.duration_min || ' minutes')::interval)
         OR
         -- Existing appointment starts during the new one
         (a.scheduled_at >= $1::timestamptz AND a.scheduled_at < $1::timestamptz + ($2 || ' minutes')::interval)
       )`,
      [scheduled_at, duration]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }

    const result = await pool.query(
      `INSERT INTO appointments (user_id, dog_id, service_id, scheduled_at, customer_notes, price_charged, status)
       VALUES ($1,$2,$3,$4,$5,$6,'függőben') RETURNING *`,
      [req.user.id, dog_id, service_id, scheduled_at, customer_notes || null, service.rows[0].price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log('Appointment error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/appointments/booked-dates', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(scheduled_at AT TIME ZONE 'Europe/Budapest') as date, COUNT(*) as count
       FROM appointments
       WHERE status IN ('függőben', 'jóváhagyva')
       AND scheduled_at >= NOW()
       GROUP BY DATE(scheduled_at AT TIME ZONE 'Europe/Budapest')`
    );
    const fullyBooked = result.rows
      .filter(r => parseInt(r.count) >= 16)
      .map(r => r.date.toISOString().split('T')[0]);
    res.json(fullyBooked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/appointments', authMiddleware, async (req, res) => {
  console.log('Fetching appointments for user:', req.user.id); // ← add
  try {
    const result = await pool.query(
      `SELECT a.*, s.name as service_name, s.duration_min,
              d.name as dog_name, d.breed
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       JOIN dogs d ON a.dog_id = d.id
       WHERE a.user_id = $1
       ORDER BY a.scheduled_at DESC`,
      [req.user.id]
    );
    console.log('Found appointments:', result.rows.length); // ← add
    res.json(result.rows);
  } catch (err) {
    console.log('Appointments error:', err.message); // ← add
    res.status(500).json({ error: err.message });
  }
});

// Cancel appointment
app.put('/api/appointments/:id/cancel', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      `UPDATE appointments SET status = 'visszamodva'
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Appointment cancelled.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});