import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './CheckIn.css';

import brightIcon from '../../components/asserts/bright.svg';
import clockIcon from '../../components/asserts/clock.svg';
import bagageIcon from '../../components/asserts/Bagage.svg';
import pdfIcon from '../../components/asserts/pdficon.svg';

import Modal from '../Home/components/Modal/Modal';
import BaggageSelect from '../Home/components/Modal/BaggageSelect';
import SeatMap from '../Home/components/Modal/SeatMap';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

const CheckIn = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [activeBooking, setActiveBooking] = useState(null);
    const [checkedIn, setCheckedIn] = useState({});

    const handleBaggageChange = (bookingId, newBaggage) => {
        setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, baggage: newBaggage } : b
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

    const handleCheckIn = (bookingId) => {
        setCheckedIn(prev => ({ ...prev, [bookingId]: true }));
        setModal('boardingpass');
    };

    const location = useLocation();
    const cardRefs = useRef({});

    useEffect(() => {
        getUserBookings()
        .then(data => setBookings(data))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
    if (!loading && location.state?.bookingId) {
        const el = cardRefs.current[location.state.bookingId];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    }, [loading, location.state]);

    return (
        <div className="manage-booking-wrapper">
        <Navbar />
        <div className="manage-booking-container">

            <header className="mb-header">
            <div className="mb-header-left">
                <h1>Odprawa online</h1>
                <p>Odpraw się przed lotem i pobierz kartę pokładową.</p>
            </div>
            </header>

            <section className="mb-content">
            <h2>Twoje loty</h2>

            {loading && <p>Ładowanie lotów...</p>}
            {!loading && bookings.length === 0 && <p>Nie masz żadnych rezerwacji.</p>}

            {bookings.map(booking => (
                <div className="flight-card" key={booking.id} ref={el => cardRefs.current[booking.id] = el}>
                <div className="flight-card-header">
                    <div className="fc-status">
                    {checkedIn[booking.id]
                        ? <span className="badge-checkedin">ODPRAWIONY</span>
                        : <span className="badge-confirmed">POTWIERDZONA</span>
                    }
                    <span className="reservation-number">Rezerwacja: {booking.id}</span>
                    </div>
                    <div className="fc-time">
                    <img src={clockIcon} alt="czas" className="inline-icon" />
                    Odprawa otwarta za: {booking.checkInDaysLeft} dni
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
                        <div className="line"><span className="dot"></span></div>
                        <p className="type">{booking.type}</p>
                        </div>
                        <div className="arrival">
                        <h3>{booking.timeTo}</h3>
                        <p>{booking.to}</p>
                        </div>
                    </div>

                    <div className="passengers-info">
                        <h4>Pasażerowie</h4>
                        <div className="passenger">
                        <div className="p-avatar">{booking.passenger?.[0]?.initials}</div>
                        <div className="p-details">
                            <p className="p-name">{booking.passenger?.[0]?.name} <span className="badge-main">Główny</span></p>
                            <p className="p-type">{booking.passenger?.[0]?.type}</p>
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
                    <h4>Odprawa</h4>

                    <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('seats'); }}>
                        <img src={brightIcon} className="btn-icon" /> Wybierz / zmień miejsce
                    </button>

                    <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('baggage'); }}>
                        <img src={bagageIcon} className="btn-icon" /> Dodaj bagaż
                    </button>

                    {checkedIn[booking.id] ? (
                        <button className="btn-outline" onClick={() => { setActiveBooking(booking); setModal('boardingpass'); }}>
                        <img src={pdfIcon} className="btn-icon" /> Pobierz boarding pass
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={() => { setActiveBooking(booking); handleCheckIn(booking.id); }}>
                        ✓ Potwierdź odprawę
                        </button>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </section>
        </div>
        <Footer />

        <Modal isOpen={!!modal} onClose={() => setModal(null)}>
            {modal === 'seats' && (
            <SeatMap
                booking={activeBooking}
                onConfirm={(seats) => handleSeatChange(activeBooking.id, seats)}
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
            {modal === 'boardingpass' && (
            <div className="confirmation">
                <div className="confirmation-icon">🛫</div>
                <h3>Odprawa potwierdzona!</h3>
                <p>Karta pokładowa dla rezerwacji <strong>{activeBooking?.id}</strong> została wysłana na Twój adres email. Pamiętaj o jej wydruku przed lotem.</p>
                <div className="cancel-actions">
                <button className="btn-primary" onClick={() => setModal(null)}>OK</button>
                </div>
            </div>
            )}
        </Modal>
        </div>
    );
};

export default CheckIn;