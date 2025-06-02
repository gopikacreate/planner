import React, { useState } from "react";

export default function ImageGallery({ gallery, handleGalleryUpload, deleteGalleryImage }) {
  const [modalImage, setModalImage] = useState(null);

  return (
    <div className="gallery-section">
      <h3>Image Gallery</h3>

      {/* Upload Button */}
      <div className="file-upload">
        <label htmlFor="fileInput" className="file-upload-label">
          Choose File
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleGalleryUpload}
        />
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {gallery.map((imgUrl, index) => (
          <div key={index} className="gallery-item">
            <img
              src={imgUrl}
              alt="Gallery"
              onClick={() => setModalImage(imgUrl)}
            />
            <button
              className="delete-gallery-btn"
              onClick={() => deleteGalleryImage(index)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content">
            <img src={modalImage} alt="Full View" />
          </div>
        </div>
      )}
    </div>
  );
}
