import React from 'react';
import './AlbumCard.css';

const AlbumCard = ({ title, images, owner, date }) => {
    // Determine cover image (first one or placeholder)
    const coverImage = (images && images.length > 0) ? images[0] : "https://via.placeholder.com/400x300?text=No+Images";
    const count = images ? images.length : 0;

    return (
        <div className="album-card">
            <div className="album-cover-container">
                <img src={coverImage} alt={title} className="album-cover" />
                <div className="album-overlay">
                    <span className="photo-count">
                        <span className="material-icons count-icon">photo_library</span>
                        {count} Photos
                    </span>
                </div>
            </div>
            <div className="album-content">
                <h3 className="album-title">{title}</h3>
                <div className="album-footer">
                    {owner && (
                        <div className="album-author">
                            <span className="material-icons author-icon">person</span>
                            <span>{owner.username || "Unknown"}</span>
                        </div>
                    )}
                    <span className="album-date">{date || "Recently"}</span>
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;
