import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import './App.css';
 import Auth from './pages/Auth';
 import Profile from './pages/Profile';
 import { Navigate } from 'react-router-dom';
function App() {
  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem('user')) || null
    );
  const [theme, setTheme] = useState(
  localStorage.getItem('theme') || 'light'
    );

  // Apply theme to the whole page
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
    const newTheme = prev === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return newTheme;
  });
  <Navbar theme={theme} toggleTheme={toggleTheme} user={user} />
  };
  function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  }
  return (
    <BrowserRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
         
         <Route path="/login"   element={<Auth />} />
         <Route path="/booking" element={<Booking />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        </Routes>
      </div>
       <Footer />
    </BrowserRouter>
  );

}

export default App;