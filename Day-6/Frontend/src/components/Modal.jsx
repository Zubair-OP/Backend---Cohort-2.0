import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, message, type = 'error' }) => {
    if (!isOpen) return null;

    const icon = type === 'success' ? 'check_circle' : 'error_outline';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <span className={`material-icons modal-icon ${type}`}>
                    {icon}
                </span>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <button className="modal-btn" onClick={onClose}>
                    Okay
                </button>
            </div>
        </div>
    );
};

export default Modal;
