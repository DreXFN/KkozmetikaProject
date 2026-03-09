import { useEffect, useState } from 'react';
import './Gallery.css';

function Gallery() {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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
      <div className="gallery-hero">
        <h1>Képgaléria</h1>
        <p>Munkáim és szőrös vendégeim</p>
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
            onClick={() => setSelected(img)}
          >
            <img src={img.url} alt={`Galéria ${i + 1}`} />
            <div className="gallery-overlay">
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="gallery-lightbox" onClick={() => setSelected(null)}>
          <button className="lightbox-close" onClick={() => setSelected(null)}>✕</button>
          <img
            src={selected.url}
            alt="Nagy kép"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Gallery;