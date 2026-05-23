import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './ManageBooking.css';

import brightIcon from '../../components/asserts/bright.svg';
import clockIcon from '../../components/asserts/clock.svg';
import bagageIcon from '../../components/asserts/Bagage.svg';
import qrcodeIcon from '../../components/asserts/qrcodeicon.svg';
import pdfIcon from '../../components/asserts/pdficon.svg';
import calendarIcon from '../../components/asserts/calendar2.svg';
import cancelIcon from '../../components/asserts/cancel.svg';

import Modal from '../Home/components/Modal/Modal';
import CancelConfirm from '../Home/components/Modal/CancelConfirm';
import DateChange from '../Home/components/Modal/DateChange';
import BaggageSelect from '../Home/components/Modal/BaggageSelect';
import SeatMap from '../Home/components/Modal/SeatMap';

import { useNavigate } from 'react-router-dom';

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const navigate = useNavigate();

  const handleCancel = (bookingId) => {
  setBookings(prev => prev.filter(b => b.id !== bookingId));
  setModal(null);
  };

  const handleDateChange = (bookingId, newDate) => {
  setBookings(prev => prev.map(b => 
    b.id === bookingId ? { ...b, date: newDate } : b
  ));
  setModal(null);
  };

  const handleBaggageChange = (bookingId, newBaggage) => {
    const option = BAGGAGE_OPTIONS.find(o => o.id === newBaggage);
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, baggage: option.label } : b
    ));
    setModal(null);
  };

  const handleSeatChange = (bookingId, seats) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? {
        ...b,
        passenger: b.passenger.map((p, i) => ({ ...p, seat: seats[i] || null })),
      } : b
    ));
    setModal(null);
  };

  useEffect(() => {
    getUserBookings()
      .then(data => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="manage-booking-wrapper">
      <Navbar />
      <div className="manage-booking-container">
        
        <header className="mb-header">
          <div className="mb-header-left">
            <h1>Cześć, {bookings[0]?.passenger?.[0]?.name.split(' ')[0] ?? 'Użytkowniku'}!</h1>
            <p>Zarządzaj swoją podróżą, dodaj usługi lub zmień plany.</p>
          </div>
          <div className="mb-reward">
            <span>Program lojalnościowy: <span className="star-icon">⭐️</span> <span className="points">{bookings[0]?.points} PKT</span></span>
          </div>
        </header>

        <section className="mb-content">
          <h2>Twoje rezerwacje</h2>

          {loading && <p>Ładowanie rezerwacji...</p>}

          {!loading && bookings.length === 0 && (
            <p>Nie masz żadnych rezerwacji.</p>
          )}

          {bookings.map(booking => (
            <div className="flight-card" key={booking.id}>
          
          <div className="flight-card">
            <div className="flight-card-header">
              <div className="fc-status">
                <span className="badge-confirmed">POTWIERDZONA</span>
                <span className="reservation-number">Rezerwacja: {booking.id}</span>
              </div>
              <div className="fc-time">
                <img src={clockIcon} alt="czas" className="inline-icon" /> Odprawa otwarta za: {booking.checkInDaysLeft} dni
              </div>
            </div>

            <div className="flight-card-body">
              <div className="fc-main-info">
                <div className="airline-info">
                  <span className="airline-logo">{booking.airlineInitial}</span>
                  <span className="airline-name">{booking.airline}</span>
                </div>

                <div className="flight-timeline">
                  <div className="departure">
                    <h3>{booking.timeFrom}</h3>
                    <p>{booking.from}</p>
                  </div>
                  <div className="duration">
                    <p>{booking.duration}</p>
                    <div className="line">
                      <span className="dot"></span>
                    </div>
                    <p className="type">{booking.type}</p>
                  </div>
                  <div className="arrival">
                    <h3>{booking.timeTo}</h3>
                    <p>{booking.to}</p>
                  </div>
                </div>

                <div className="passengers-info">
                  <h4>Pasażerowie na tej rezerwacji</h4>
                  <div className="passenger">
                    <div className="p-avatar">{booking.passenger?.[0]?.initials}</div>
                    <div className="p-details">
                      <p className="p-name">{booking.passengerName} <span className="badge-main">Główny</span></p>
                      <p className="p-type">{booking.passengerType}</p>
                    </div>
                  </div>

                  <div className="passenger-addons">
                    <div className="addon-box">
                      <img src={bagageIcon} alt="bagaż" className="addon-icon-svg" />
                      <div>
                        <p className="addon-title">Bagaż</p>
                        <p className="addon-desc">{booking.baggage}</p>
                      </div>
                    </div>
                    <div className="addon-box">
                      <img src={brightIcon} alt="miejsce" className="addon-icon-svg" />
                      <div>
                        <p className="addon-title">Miejsce na pokładzie</p>
                        <p className="addon-desc">{booking.passenger?.[0]?.seat ?? 'Nie wybrano'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fc-actions">
                <h4>Szybkie akcje</h4>
                <button className="btn-primary" onClick={() => navigate('/odprawa', { state: { bookingId: booking.id } })}>
                  <img src={qrcodeIcon} alt="odprawa" className="btn-icon" /> Odprawa Online <span>›</span>
                </button>
                
                <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('seats'); }}>
                  <img src={brightIcon} className="btn-icon" /> Wybierz miejsce
                </button>
                
                <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('baggage'); }}>
                  <img src={bagageIcon} className="btn-icon" /> Zarządzaj bagażem
                </button>

                <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('confirmation'); }}>
                  <img src={pdfIcon} className="btn-icon" /> Pobierz potwierdzenie
                </button>
                
                <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('date'); }}>
                  <img src={calendarIcon} className="btn-icon" /> Zmień termin lotu
                </button>

                <button className="btn-cancel" onClick={() => { 
                  setActiveBooking(booking.id); 
                  setModal('cancel'); 
                }}>
                  <img src={cancelIcon} alt="anuluj" className="btn-icon" /> Anuluj całą rezerwację
                </button>
              </div>
            </div>
          </div>
          </div>
          ))}
        </section>

      </div>
      <Footer />
       <Modal isOpen={!!modal} onClose={() => setModal(null)}>
        {modal === 'cancel' && (
          <CancelConfirm
            bookingId={activeBooking}
            onConfirm={() => handleCancel(activeBooking?.id )}
            onClose={() => setModal(null)}
          />
        )}
        {modal === 'date' && (
        <DateChange
          bookingId={activeBooking?.id}
          currentDate={activeBooking?.date}
          onConfirm={(date) => handleDateChange(activeBooking.id, date)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'baggage' && (
        <BaggageSelect
          bookingId={activeBooking?.id}
          currentBaggage={activeBooking?.baggageType}
          onConfirm={(baggage) => handleBaggageChange(activeBooking.id, baggage)}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'seats' && (
        <SeatMap
          booking={activeBooking}
          onConfirm={(seats) => handleSeatChange(activeBooking.id, seats)}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'confirmation' && (
        <div className="confirmation">
          <div className="confirmation-icon">✉️</div>
          <h3>Potwierdzenie wysłane!</h3>
          <p>Potwierdzenie rezerwacji <strong>{activeBooking?.id}</strong> zostało wysłane na Twój adres email.</p>
          <div className="cancel-actions">
            <button className="btn-primary" onClick={() => setModal(null)}>OK</button>
          </div>
        </div>
      )}
      </Modal>   

    </div>
  );
};

export default ManageBooking;
