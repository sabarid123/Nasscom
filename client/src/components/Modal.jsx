import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-card border-0 text-light p-3">
          <div className="modal-header border-bottom border-secondary">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
