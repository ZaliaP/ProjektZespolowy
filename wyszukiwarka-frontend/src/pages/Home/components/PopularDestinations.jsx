import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularDestinations.css';
import planeSmallIcon from '../../../components/asserts/smallairplane.svg';
import londynImg from '../../../components/asserts/londyn.png';
import rzymImg from '../../../components/asserts/Rzym.png';
import paryzImg from '../../../components/asserts/paryz.png';
import dubajImg from '../../../components/asserts/dubaj.png';
import { buildSearchQuery, saveRecentSearch } from '../../../utils/searchStorage';

const MOCK_DESTINATIONS = [
  {
    id: 1,
    city: 'Londyn',
    airportCode: 'LHR',
    country: 'UK',
    price: 'od 199 zł',
    image: londynImg,
    desc: 'Loty bezpośrednie z Warszawy'
  },
  {
    id: 2,
    city: 'Rzym',
    airportCode: 'FCO',
    country: 'Włochy',
    price: 'od 249 zł',
    image: rzymImg,
    desc: 'Idealne na weekend'
  },
  {
    id: 3,
    city: 'Paryż',
    airportCode: 'CDG',
    country: 'Francja',
    price: 'od 289 zł',
    image: paryzImg,
    desc: 'Miasto miłości czeka'
  },
  {
    id: 4,
    city: 'Dubaj',
    airportCode: 'DXB',
    country: 'ZEA',
    price: 'od 899 zł',
    image: dubajImg,
    desc: 'Egzotyka w zasięgu ręki'
  }
];

const PopularDestinations = () => {
  const navigate = useNavigate();

  const handleDestinationClick = (destination) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);

    const returnDate = new Date(tomorrow);
    returnDate.setDate(returnDate.getDate() + 7);

    const search = {
      origin: 'WAW',
      dest: destination.airportCode,
      dateOut: tomorrow.toISOString().slice(0, 10),
      dateReturn: returnDate.toISOString().slice(0, 10),
      tripType: 'roundTrip',
    };

    saveRecentSearch(search);
    navigate(`/wyniki-wyszukiwania?${buildSearchQuery(search)}`);
  };

  return (
    <section className="destinations-section">
      <div className="section-header">
        <h2>Popularne kierunki</h2>
        <p>Inspiracje na Twoją następną podróż.</p>
      </div>

      <div className="destinations-grid">
        {MOCK_DESTINATIONS.map(dest => (
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
  );
};

export default PopularDestinations;
