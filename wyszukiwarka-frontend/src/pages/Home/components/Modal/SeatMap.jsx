import React, { useState } from 'react';

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];
const ROWS = Array.from({ length: 30 }, (_, i) => i + 1);

const SeatMap = ({ booking, onConfirm, onClose }) => {
  const passengersCount = booking.passenger.length;
  const [selectedSeats, setSelectedSeats] = useState(
    booking.passenger.map(p => p.seat).filter(Boolean)
  );

  const handleSeatClick = (seatId) => {
    if (booking.takenSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      return;
    }

    if (selectedSeats.length >= passengersCount) {
      // zamień najstarszy wybór
      setSelectedSeats(prev => [...prev.slice(1), seatId]);
      return;
    }

    setSelectedSeats(prev => [...prev, seatId]);
  };

  const getSeatStatus = (seatId) => {
    if (booking.takenSeats.includes(seatId)) return 'taken';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'free';
  };

  return (
    <div className="seat-map-wrapper">
      <h3>Wybierz miejsce</h3>
      <p>Rezerwacja <strong>{booking.id}</strong> · wybierz {passengersCount} {passengersCount === 1 ? 'miejsce' : 'miejsca'}</p>

      <div className="seat-legend">
        <div className="legend-item"><span className="seat-preview free"></span> Wolne</div>
        <div className="legend-item"><span className="seat-preview taken"></span> Zajęte</div>
        <div className="legend-item"><span className="seat-preview selected"></span> Wybrane</div>
      </div>

      <div className="seat-map">
        <div className="seat-columns-header">
          <span className="row-number"></span>
          {COLUMNS.map(col => (
            <React.Fragment key={col}>
              <span className="col-label">{col}</span>
              {col === 'C' && <span className="aisle"></span>}
            </React.Fragment>
          ))}
        </div>

        <div className="seat-rows">
          {ROWS.map(row => (
            <div key={row} className="seat-row">
              <span className="row-number">{row}</span>
              {COLUMNS.map(col => {
                const seatId = `${row}${col}`;
                const status = getSeatStatus(seatId);
                return (
                  <React.Fragment key={col}>
                    <button
                      className={`seat ${status}`}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'taken'}
                      title={seatId}
                    >
                      {status === 'selected' ? '✓' : ''}
                    </button>
                    {col === 'C' && <span className="aisle"></span>}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="seat-selected-info">
        Wybrane: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'brak'}
      </div>

      <div className="cancel-actions">
        <button className="btn-outline" onClick={onClose}>Wróć</button>
        <button
          className="btn-primary"
          onClick={() => onConfirm(selectedSeats)}
          disabled={selectedSeats.length !== passengersCount}
        >
          Potwierdź miejsca
        </button>
      </div>
    </div>
  );
};

export default SeatMap;