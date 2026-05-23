import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import './Offers.css';

import airplaneIcon from '../../components/asserts/airplane.svg';
import planeSmallIcon from '../../components/asserts/smallairplane.svg';
import londynImg from '../../components/asserts/londyn.png';
import rzymImg from '../../components/asserts/Rzym.png';
import paryzImg from '../../components/asserts/paryz.png';
import dubajImg from '../../components/asserts/dubaj.png';
import { buildSearchQuery, saveRecentSearch } from '../../utils/searchStorage';

const ALL_FLIGHTS = [
  { id: 1, from: 'Warszawa', fromCode: 'WAW', to: 'Oslo', toCode: 'OSL', dates: '12 - 15 Cze', type: 'Bezpośredni', price: 79 },
  { id: 2, from: 'Gdańsk', fromCode: 'GDN', to: 'Sztokholm', toCode: 'ARN', dates: '20 - 25 Gru', type: 'Bezpośredni', price: 89 },
  { id: 3, from: 'Warszawa', fromCode: 'WAW', to: 'Wiedeń', toCode: 'VIE', dates: '21 - 25 Paź', type: 'Bezpośredni', price: 129 },
  { id: 4, from: 'Kraków', fromCode: 'KRK', to: 'Mediolan', toCode: 'MXP', dates: '22 - 24 Sie', type: 'Bezpośredni', price: 119 },
  { id: 5, from: 'Wrocław', fromCode: 'WRO', to: 'Sztokholm', toCode: 'ARN', dates: '10 - 15 Lis', type: 'Bezpośredni', price: 149 },
  { id: 6, from: 'Poznań', fromCode: 'POZ', to: 'Paryż', toCode: 'CDG', dates: '14 - 19 Lut', type: '1 Przesiadka', price: 169 },
  { id: 7, from: 'Warszawa', fromCode: 'WAW', to: 'Barcelona', toCode: 'BCN', dates: '5 - 10 Lip', type: 'Bezpośredni', price: 199 },
  { id: 8, from: 'Katowice', fromCode: 'KTW', to: 'Londyn', toCode: 'LTN', dates: '3 - 8 Mar', type: 'Bezpośredni', price: 109 },
  { id: 9, from: 'Gdańsk', fromCode: 'GDN', to: 'Dublin', toCode: 'DUB', dates: '18 - 22 Kwi', type: 'Bezpośredni', price: 139 },
  { id: 10, from: 'Warszawa', fromCode: 'WAW', to: 'Ateny', toCode: 'ATH', dates: '1 - 7 Maj', type: '1 Przesiadka', price: 259 },
  { id: 11, from: 'Kraków', fromCode: 'KRK', to: 'Lizbona', toCode: 'LIS', dates: '9 - 14 Wrz', type: '1 Przesiadka', price: 229 },
  { id: 12, from: 'Wrocław', fromCode: 'WRO', to: 'Amsterdam', toCode: 'AMS', dates: '27 - 31 Paź', price: 179, type: 'Bezpośredni' },
];

const ALL_DESTINATIONS = [
  { id: 1, city: 'Londyn', airportCode: 'LHR', country: 'UK', price: 'od 199 zł', image: londynImg, desc: 'Loty bezpośrednie z Warszawy' },
  { id: 2, city: 'Rzym', airportCode: 'FCO', country: 'Włochy', price: 'od 249 zł', image: rzymImg, desc: 'Idealne na weekend' },
  { id: 3, city: 'Paryż', airportCode: 'CDG', country: 'Francja', price: 'od 289 zł', image: paryzImg, desc: 'Miasto miłości czeka' },
  { id: 4, city: 'Dubaj', airportCode: 'DXB', country: 'ZEA', price: 'od 899 zł', image: dubajImg, desc: 'Egzotyka w zasięgu ręki' },
];

const Offers = () => {
  const navigate = useNavigate();
  const [maxPrice, setMaxPrice] = useState(1000);
  const [filterType, setFilterType] = useState('wszystkie');
  const [filterCity, setFilterCity] = useState('');

  const filtered = ALL_FLIGHTS.filter(f => {
    if (f.price > maxPrice) return false;
    if (filterType === 'bezposredni' && f.type !== 'Bezpośredni') return false;
    if (filterType === 'przesiadka' && f.type === 'Bezpośredni') return false;
    if (filterCity && !f.to.toLowerCase().includes(filterCity.toLowerCase()) && !f.from.toLowerCase().includes(filterCity.toLowerCase())) return false;
    return true;
  });

  const handleFlightClick = (flight) => {
    const search = {
      origin: flight.fromCode,
      dest: flight.toCode,
      dateOut: new Date().toISOString().slice(0, 10),
      tripType: 'oneWay',
      passengers: 1,
    };
    saveRecentSearch(search);
    navigate(`/wyniki-wyszukiwania?${buildSearchQuery(search)}`);
  };

  const handleDestinationClick = (dest) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);
    const returnDate = new Date(tomorrow);
    returnDate.setDate(returnDate.getDate() + 7);
    const search = {
      origin: 'WAW',
      dest: dest.airportCode,
      dateOut: tomorrow.toISOString().slice(0, 10),
      dateReturn: returnDate.toISOString().slice(0, 10),
      tripType: 'roundTrip',
    };
    saveRecentSearch(search);
    navigate(`/wyniki-wyszukiwania?${buildSearchQuery(search)}`);
  };

  return (
    <div className="offers-wrapper">
      <Navbar />
      <div className="offers-container">

        <header className="offers-header">
          <h1>Oferty lotów</h1>
          <p>Znajdź najlepsze okazje i popularne kierunki.</p>
        </header>

        <section className="offers-section">
          <h2>Tanie loty</h2>

          <div className="offers-filters">
            <input
              type="text"
              placeholder="Szukaj miasta..."
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              className="filter-input"
            />
            <div className="filter-type-buttons">
              <button className={filterType === 'wszystkie' ? 'active' : ''} onClick={() => setFilterType('wszystkie')}>Wszystkie</button>
              <button className={filterType === 'bezposredni' ? 'active' : ''} onClick={() => setFilterType('bezposredni')}>Bezpośrednie</button>
              <button className={filterType === 'przesiadka' ? 'active' : ''} onClick={() => setFilterType('przesiadka')}>Z przesiadką</button>
            </div>
            <div className="filter-price">
              <label>Maks. cena: <strong>{maxPrice} zł</strong></label>
              <input type="range" min={50} max={1000} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
            </div>
          </div>

          {filtered.length === 0 && <p className="no-results">Brak lotów spełniających kryteria.</p>}

          <div className="flights-grid">
            {filtered.map(flight => (
              <div className="flight-row" key={flight.id} onClick={() => handleFlightClick(flight)}>
                <div className="flight-icon">
                  <img src={airplaneIcon} alt="Samolot" className="plane-svg" />
                </div>
                <div className="flight-details">
                  <h4>{flight.from} - {flight.to}</h4>
                  <p className="flight-meta">{flight.dates} • {flight.type}</p>
                </div>
                <div className="flight-price">{flight.price} zł</div>
              </div>
            ))}
          </div>
        </section>

        <section className="offers-section">
          <h2>Popularne kierunki</h2>
          <div className="destinations-grid">
            {ALL_DESTINATIONS.map(dest => (
              <button className="destination-card" key={dest.id} type="button" onClick={() => handleDestinationClick(dest)}>
                <div className="card-image-wrapper">
                  <img src={dest.image} alt={dest.city} className="card-image" />
                  <span className="card-price">{dest.price}</span>
                </div>
                <div className="card-content">
                  <div className="card-top-info">
                    <h3>{dest.city}</h3>
                    <span className="country-info">
                      <img src={planeSmallIcon} alt="plane" className="small-plane-icon" />
                      {dest.country}
                    </span>
                  </div>
                  <p className="card-desc">{dest.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default Offers;