import React, { useState } from 'react';

const BAGGAGE_OPTIONS = [
  { id: 'personal', label: 'Tylko mały plecak', desc: 'Pod siedzenie, max 40x20x25 cm', price: 0 },
  { id: 'cabin', label: 'Bagaż podręczny', desc: 'Do schowka, max 55x40x23 cm, 10 kg', price: 49 },
  { id: 'checked20', label: 'Bagaż rejestrowany 20 kg', desc: 'Do luku bagażowego', price: 89 },
  { id: 'checked32', label: 'Bagaż rejestrowany 32 kg', desc: 'Do luku bagażowego', price: 129 },
];

const BaggageSelect = ({ bookingId, currentBaggage, onConfirm, onClose }) => {
  const [selected, setSelected] = useState(currentBaggage || 'personal');

  return (
    <div className="baggage-select">
      <h3>Zarządzaj bagażem</h3>
      <p>Rezerwacja <strong>{bookingId}</strong></p>
      <div className="baggage-options">
        {BAGGAGE_OPTIONS.map(opt => (
          <div 
            key={opt.id}
            className={`baggage-option ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className="baggage-option-left">
              <p className="baggage-option-label">{opt.label}</p>
              <p className="baggage-option-desc">{opt.desc}</p>
            </div>
            <div className="baggage-option-price">
              {opt.price === 0 ? 'Bezpłatny' : `+${opt.price} zł`}
            </div>
          </div>
        ))}
      </div>
      <div className="cancel-actions">
        <button className="btn-outline" onClick={onClose}>Wróć</button>
        <button className="btn-primary" onClick={() => onConfirm(selected)}>
          Zapisz zmiany
        </button>
      </div>
    </div>
  );
};

export default BaggageSelect;