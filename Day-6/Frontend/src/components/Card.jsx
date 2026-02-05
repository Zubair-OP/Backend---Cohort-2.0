import './Card.css';

const Card = ({ _id, title, caption, image, owner, onDelete }) => {

    return (
        <div className="card">
            <div className="card-image-container">
                <img src={image || "https://via.placeholder.com/400x250"} alt={title} className="card-image" />
                <div className="card-overlay">
                    <span className="card-tag">Post</span>
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                {caption && <p className="card-description">{caption}</p>}
                <div className="card-footer">
                    <div className="author-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                        <span className="material-icons" style={{ fontSize: '1.2rem' }}>account_circle</span>
                        <span>{owner?.username || 'Anonymous'}</span>
                    </div>
                    <div className="card-actions">
                        {/* Placeholder icons */}
                        <span className="action-icon">favorite_border</span>
                        <span className="action-icon">share</span>
                        {/* Only show delete if onDelete is provided */}
                        {onDelete && (
                            <span
                                className="action-icon delete-icon"
                                onClick={onDelete}
                                title="Delete Post"
                            >
                                delete_outline
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
