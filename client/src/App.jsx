import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to the whole page
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;