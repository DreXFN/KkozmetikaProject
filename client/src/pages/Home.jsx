
import './Home.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_URL from '../api.js';
import aboutImage from '../assets/about-img.jpg';
import aboutImage2 from '../assets/about-img2.jpg';

import heroImage from '../assets/hero.webp';
import scrollArrow from '../assets/scroll-arrow.png';


function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [images, setImages]   = useState([]);
  const [current, setCurrent] = useState(0);
  const timerRef              = useRef(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const goTo = (index) => {
  clearInterval(timerRef.current);
  setCurrent(index);
};
 const openLightbox = (imgSrc) => setLightboxImage(imgSrc);
  const closeLightbox = () => setLightboxImage(null);

// const prev = () => goTo((current - 1 + images.length) % images.length);
// const next = () => goTo((current + 1) % images.length);
//   useEffect(() => {
//   const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
//   const apiKey   = import.meta.env.VITE_GOOGLE_API_KEY;

//   fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${apiKey}`)
//     .then(res => res.json())
//       .then(data => {
//     const files = data.files || [];
//     const imgs = files.map(file => ({
//       id:  file.id,
//       url: `https://lh3.googleusercontent.com/d/${file.id}`
//     }));
//     setImages(imgs);
//   })
//     .catch(err => console.log('Gallery error:', err));
// }, []);


  return (
    
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
          <div className="home-hero-image">
            <img src={heroImage} alt="Kutyakozmetika Vecsés" />
              <button
                className="hero-scroll-arrow"
                onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })}
                    >
                      <img src={scrollArrow} alt="scroll down" />
              </button>
        </div>
      {/* ── GALLERY SLIDER ──
   {images.length > 0 && (
  <div className="home-slider-section">
   

    <div className="home-slider">
      {images.map((img, i) => (
        <div
          key={img.id}
          className={`home-slide ${i === current ? 'active' : ''}`}
        >
          <img src={img.url} alt={`Galéria ${i + 1}`} />
        </div>
      ))}

      <button className="slide-arrow left" onClick={prev}>‹</button>
      <button className="slide-arrow right" onClick={next}>›</button>

      <div className="slide-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`slide-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div> 
  </div> */}


{/* ── ABOUT SECTION ── */}
<div id="about-section">
     <div className="about-name">
        <h2>Danok Zsuzsanna</h2>
        <span>Kutyakozmetikus</span>
      </div>
  <div className="home-about">
    
    <div className="about-image-wrapper">
   
      <div className="about-image" onClick={() => openLightbox(aboutImage)}>
        <img src={aboutImage}  />
      </div>
    </div>
  <div className="about-info">
  
    <h2 className="about-texta">
     Szeretettel várom a szépülni vágyó kutyusokat*!
    </h2>
      <p id="kid">
      *Kistestű kutyák teljes körű kozmetikázása (kb. spániel méretig.)
    </p>
     <div className="about-image" onClick={() => openLightbox(aboutImage2)}>
        <img src={aboutImage2}  />
      </div>
   
    <p id="rrid">Telefonos időpont egyeztetéssel,<span id='rugalom'>rugalmas időbeosztásban.</span></p>

   


 
  </div>
  </div>
</div>


{lightboxImage && (
  <div className="about-lightbox" onClick={closeLightbox}>
    <button className="lightbox-close" onClick={closeLightbox}>✕</button>
    <img src={lightboxImage} alt="Danok Zsuzsanna" onClick={e => e.stopPropagation()} />
  </div>
)}
      
      
      
      
   
    </div>
  );
}

export default Home;