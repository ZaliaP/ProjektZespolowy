import React, { useState } from 'react';

const DateChange = ({ bookingId, currentDate, onConfirm, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate || '');

  return (
    <div className="date-change">
      <h3>Zmień termin lotu</h3>
      <p>Rezerwacja <strong>{bookingId}</strong></p>
      <div className="date-input">
        <label>Wybierz nową datę</label>
        <input 
          type="date" 
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="cancel-actions">
        <button className="btn-outline" onClick={onClose}>Wróć</button>
        <button 
          className="btn-primary" 
          onClick={() => onConfirm(selectedDate)}
          disabled={!selectedDate}
        >
          Potwierdź zmianę
        </button>
      </div>
    </div>
  );
};

export default DateChange;