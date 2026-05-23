import React from 'react';

const CancelConfirm = ({ bookingId, onConfirm, onClose }) => {
  return (
    <div className="cancel-confirm">
      <h3>Anulować rezerwację?</h3>
      <p>Czy na pewno chcesz anulować rezerwację <strong>{bookingId}</strong>? Tej operacji nie można cofnąć.</p>
      <div className="cancel-actions">
        <button className="btn-outline" onClick={onClose}>Wróć</button>
        <button className="btn-cancel" onClick={onConfirm}>Tak, anuluj</button>
      </div>
    </div>
  );
};

export default CancelConfirm;