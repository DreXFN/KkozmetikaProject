import { useEffect, useState } from 'react';
import './Gallery.css';
import heroImage from '../assets/hero-crop.webp';

function Gallery() {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

const openImage = (index) => setSelectedIndex(index);
const closeImage = () => setSelectedIndex(null);
const prevImage = (e) => { e.stopPropagation(); setSelectedIndex(i => (i - 1 + images.length) % images.length); };
const nextImage = (e) => { e.stopPropagation(); setSelectedIndex(i => (i + 1) % images.length); };

  useEffect(() => {
    const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
    const apiKey   = import.meta.env.VITE_GOOGLE_API_KEY;

    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        const files = data.files || [];
        const imgs = files.map(file => ({
          id:  file.id,
          url: `https://lh3.googleusercontent.com/d/${file.id}`
        }));
        setImages(imgs);
        setLoading(false);
      })
      .catch(err => {
        console.log('Gallery error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="gallery-page">
            <div className="page-hero">
            <img src={heroImage} alt="hero" />
            <div className="page-hero-overlay">
          <h1>Képgaléria</h1>
          <p>Munkáim és szőrös vendégeim</p>
        </div>
      </div>

      {loading && (
        <div className="gallery-loading">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="gallery-empty">
          <p>Nincs megjeleníthető kép.</p>
        </div>
      )}

      <div className="gallery-grid">
     {images.map((img, i) => (
  <div
    key={img.id}
    className="gallery-item"
    onClick={() => openImage(i)}
  >
    <img src={img.url} alt={`Galéria ${i + 1}`} />
    <div className="gallery-overlay"><span></span></div>
  </div>
))}
      </div>

       {selectedIndex !== null && (
  <div className="gallery-lightbox" onClick={closeImage}>
    <button className="lightbox-close" onClick={closeImage}>✕</button>
    <button className="lightbox-arrow left" onClick={prevImage}>‹</button>
    <img
      src={images[selectedIndex].url}
      alt="Nagy kép"
      onClick={e => e.stopPropagation()}
    />
    <button className="lightbox-arrow right" onClick={nextImage}>›</button>
    <div className="lightbox-counter">{selectedIndex + 1} / {images.length}</div>
  </div>
)}
    </div>
  );
}

export default Gallery;