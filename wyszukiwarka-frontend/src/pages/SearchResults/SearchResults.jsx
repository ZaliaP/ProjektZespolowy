import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { searchFlights } from '../../services/api';
import './SearchResults.css';

import calendarIcon from '../../components/asserts/calendar2.svg';
import userIcon from '../../components/asserts/person.svg';
import bagageIcon from '../../components/asserts/Bagage.svg';
import brightIcon from '../../components/asserts/bright.svg';
import bellIcon from '../../components/asserts/bell.svg';
import sunIcon from '../../components/asserts/sun.svg';
import halfSunIcon from '../../components/asserts/halfsun.svg';
import moonIcon from '../../components/asserts/moon.svg';
import leafIcon from '../../components/asserts/leaf.svg';

const defaultAirlines = {
  wizz: true,
  ryanair: true,
  lot: true,
  lufthansa: true,
};

const defaultBaggage = {
  personal: true,
  cabin: true,
  checked: true,
};

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('cheapest');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [stopsDirect, setStopsDirect] = useState(true);
  const [stopsOne, setStopsOne] = useState(true);
  const [stopsMulti, setStopsMulti] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [airlines, setAirlines] = useState(defaultAirlines);
  const [baggage, setBaggage] = useState(defaultBaggage);
  const [expandedFlight, setExpandedFlight] = useState(1);

  const origin = searchParams.get('origin') || 'WAW';
  const destination = searchParams.get('dest') || 'LHR';
  const outboundDate = searchParams.get('dateOut') || '15 cze';
  const returnDate = searchParams.get('dateReturn') || '22 cze';
  const passengers = Number(searchParams.get('passengers') || '1');
  const cabinClass = searchParams.get('cabinClass') || 'economy';

  const cabinClassLabelMap = {
    economy: 'Ekonomiczna',
    premium: 'Premium Economy',
    business: 'Biznes',
    first: 'Pierwsza Klasa',
  };

  useEffect(() => {
    let cancelled = false;

    async function loadFlights() {
      setLoading(true);
      const data = await searchFlights({
        origin,
        dest: destination,
        dateOut: outboundDate,
      });

      if (!cancelled) {
        setFlights(data);
        setLoading(false);
      }
    }

    loadFlights();

    return () => {
      cancelled = true;
    };
  }, [destination, origin, outboundDate]);

  const processedFlights = useMemo(() => {
    const visibleFlights = flights.filter((flight) => {
      if (flight.price > maxPrice) return false;
      if (flight.stops === 0 && !stopsDirect) return false;
      if (flight.stops === 1 && !stopsOne) return false;
      if (flight.stops > 1 && !stopsMulti) return false;
      if (!airlines[flight.airlineKey]) return false;
      if (!baggage[flight.baggageType]) return false;

      if (timeFilter !== 'all') {
        const departureHour = Number(flight.timeFrom.split(':')[0]);
        if (timeFilter === 'morning' && departureHour >= 12) return false;
        if (timeFilter === 'afternoon' && (departureHour < 12 || departureHour >= 18)) return false;
        if (timeFilter === 'evening' && departureHour < 18) return false;
      }

      return true;
    });

    const sortedFlights = [...visibleFlights];

    if (activeTab === 'cheapest') {
      sortedFlights.sort((left, right) => left.price - right.price);
    } else if (activeTab === 'fastest') {
      sortedFlights.sort((left, right) => left.durationMinutes - right.durationMinutes);
    } else {
      sortedFlights.sort(
        (left, right) => left.price + left.durationMinutes - (right.price + right.durationMinutes),
      );
    }

    return sortedFlights;
  }, [activeTab, airlines, baggage, flights, maxPrice, stopsDirect, stopsMulti, stopsOne, timeFilter]);

  const airlinePriceMap = useMemo(() => {
    const map = {};
    flights.forEach((flight) => {
      if (!map[flight.airlineKey] || flight.price < map[flight.airlineKey]) {
        map[flight.airlineKey] = flight.price;
      }
    });
    return map;
  }, [flights]);

  function resetFilters() {
    setMaxPrice(1200);
    setStopsDirect(true);
    setStopsOne(true);
    setStopsMulti(true);
    setTimeFilter('all');
    setAirlines(defaultAirlines);
    setBaggage(defaultBaggage);
  }

  function toggleAirline(airlineKey) {
    setAirlines((current) => ({ ...current, [airlineKey]: !current[airlineKey] }));
  }

  function toggleBaggage(baggageKey) {
    setBaggage((current) => ({ ...current, [baggageKey]: !current[baggageKey] }));
  }

  function toggleExpandedFlight(flightId) {
    setExpandedFlight((current) => (current === flightId ? null : flightId));
  }

  function getAirlineClass(airlineKey) {
    if (airlineKey === 'lot' || airlineKey === 'ryanair') return 'lot';
    if (airlineKey === 'lufthansa') return 'lufthansa';
    return 'wizz';
  }

  function getAirlineShort(airlineKey) {
    if (airlineKey === 'lot') return 'LOT';
    if (airlineKey === 'ryanair') return 'FR';
    if (airlineKey === 'lufthansa') return 'L';
    return 'W';
  }

  return (
    <div className="search-results-wrapper manage-booking-wrapper">
      <Navbar />

      <div className="search-summary-bar">
        <div className="summary-container">
          <div className="summary-route">
            <div className="route-city">
              <span className="city-code">{origin}</span>
              <span className="city-name">Warszawa</span>
            </div>
            <span className="route-arrow">→</span>
            <div className="route-city">
              <span className="city-code">{destination}</span>
              <span className="city-name">Londyn</span>
            </div>
          </div>

          <div className="summary-details">
            <div className="detail-item">
              <img src={calendarIcon} alt="data" className="inline-icon" /> {outboundDate} - {returnDate}
            </div>
            <div className="detail-item">
              <img src={userIcon} alt="pasażer" className="inline-icon" /> {passengers} {passengers === 1 ? 'pasażer' : 'pasażerów'}
            </div>
            <div className="detail-item">
              <img src={brightIcon} alt="klasa" className="inline-icon" /> {cabinClassLabelMap[cabinClass] || 'Ekonomiczna'}
            </div>
          </div>

          <div className="summary-actions">
            <button className="btn-track-prices">
              <img src={bellIcon} alt="dzwonek" className="inline-icon" /> Śledź ceny
            </button>
          </div>
        </div>
      </div>

      <div className="search-results-content">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filtry</h3>
            <button className="btn-reset" onClick={resetFilters}>Zresetuj</button>
          </div>

          <div className="filter-section">
            <h4>Przesiadki</h4>
            <label className="checkbox-label">
              <input type="checkbox" checked={stopsDirect} onChange={(event) => setStopsDirect(event.target.checked)} />
              <span className="label-text">Bezpośredni</span>
              <span className="price-tag">199 zł</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={stopsOne} onChange={(event) => setStopsOne(event.target.checked)} />
              <span className="label-text">1 przesiadka</span>
              <span className="price-tag">450 zł</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={stopsMulti} onChange={(event) => setStopsMulti(event.target.checked)} />
              <span className="label-text">2+ przesiadki</span>
              <span className="price-tag">820 zł</span>
            </label>
          </div>

          <div className="filter-section">
            <h4>Maksymalna cena</h4>
            <div className="price-slider-header">
              <span className="max-price-value">{maxPrice} zł</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="price-slider"
            />
          </div>

          <div className="filter-section">
            <h4>Godziny wylotu (z {origin})</h4>
            <div className="time-buttons">
              <button className={`time-btn ${timeFilter === 'morning' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === 'morning' ? 'all' : 'morning')}>
                <img src={sunIcon} alt="rano" className="time-icon-svg" />
                <span className="time-name">Rano</span>
                <span className="time-range">00:00 - 11:59</span>
              </button>
              <button className={`time-btn ${timeFilter === 'afternoon' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === 'afternoon' ? 'all' : 'afternoon')}>
                <img src={halfSunIcon} alt="popołudnie" className="time-icon-svg" />
                <span className="time-name">Popołudnie</span>
                <span className="time-range">12:00 - 17:59</span>
              </button>
              <button className={`time-btn ${timeFilter === 'evening' ? 'active' : ''}`} onClick={() => setTimeFilter(timeFilter === 'evening' ? 'all' : 'evening')}>
                <img src={moonIcon} alt="wieczór" className="time-icon-svg" />
                <span className="time-name">Wieczór</span>
                <span className="time-range">18:00 - 23:59</span>
              </button>
            </div>
          </div>

          <div className="filter-section">
            <h4>Wliczony bagaż</h4>
            <label className="checkbox-label">
              <input type="checkbox" checked={baggage.personal} onChange={() => toggleBaggage('personal')} />
              <span className="label-text">Mały plecak (pod siedzenie)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={baggage.cabin} onChange={() => toggleBaggage('cabin')} />
              <span className="label-text">Bagaż podręczny (w schowku)</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={baggage.checked} onChange={() => toggleBaggage('checked')} />
              <span className="label-text">Bagaż rejestrowany (23kg)</span>
            </label>
          </div>

          <div className="filter-section">
            <h4>Linie lotnicze</h4>
            <label className="checkbox-label">
              <input type="checkbox" checked={airlines.wizz} onChange={() => toggleAirline('wizz')} />
              <span className="label-text">Wizz Air</span>
              <span className="price-tag">{airlinePriceMap.wizz || 199} zł</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={airlines.ryanair} onChange={() => toggleAirline('ryanair')} />
              <span className="label-text">Ryanair</span>
              <span className="price-tag">{airlinePriceMap.ryanair || 285} zł</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={airlines.lot} onChange={() => toggleAirline('lot')} />
              <span className="label-text">LOT</span>
              <span className="price-tag">{airlinePriceMap.lot || 450} zł</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={airlines.lufthansa} onChange={() => toggleAirline('lufthansa')} />
              <span className="label-text">Lufthansa</span>
              <span className="price-tag">{airlinePriceMap.lufthansa || 820} zł</span>
            </label>
          </div>
        </aside>

        <main className="results-main">
          <div className="results-tabs">
            <button className={`tab ${activeTab === 'best' ? 'active' : ''}`} onClick={() => setActiveTab('best')}>
              <span className="tab-title">Najlepszy</span>
              <span className="tab-desc">Balans ceny i czasu</span>
            </button>
            <button className={`tab ${activeTab === 'cheapest' ? 'active' : ''}`} onClick={() => setActiveTab('cheapest')}>
              <span className="tab-title">Najtańszy</span>
              <span className="tab-desc">Najniższa cena</span>
            </button>
            <button className={`tab ${activeTab === 'fastest' ? 'active' : ''}`} onClick={() => setActiveTab('fastest')}>
              <span className="tab-title">Najszybszy</span>
              <span className="tab-desc">Najkrótszy czas lotu</span>
            </button>
          </div>

          <div className="price-alert-box">
            <div className="alert-content">
              <div className="alert-icon"><img src={bellIcon} alt="alert" className="alert-icon-svg" /></div>
              <div className="alert-text">
                <h4>Ceny dla twojej trasy mogą wzrosnąć!</h4>
                <p>Włącz powiadomienia aby dostać alert gdy ceny spadną</p>
              </div>
            </div>
            <button className="btn-alert">Powiadom mnie</button>
          </div>

          <div className="flights-list">
            {loading ? <div style={{ padding: '40px', textAlign: 'center' }}>Ładowanie lotów...</div> : null}
            {!loading && processedFlights.length === 0 ? <div style={{ padding: '40px', textAlign: 'center' }}>Brak lotów dla aktualnych filtrów.</div> : null}

            {!loading && processedFlights.map((flight, index) => {
              const isExpanded = expandedFlight === flight.id;

              return (
                <div key={flight.id} className={`flight-card result-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="rc-body">
                    <div className="rc-info">
                      <div className="rc-main">
                        <div className="rc-airline">
                          <div className={`rc-airline-logo ${getAirlineClass(flight.airlineKey)}`}>{getAirlineShort(flight.airlineKey)}</div>
                          <span className="rc-airline-name">{flight.airline.toUpperCase()}</span>
                        </div>
                        <div className="rc-tags">
                          {flight.co2Saving ? <span className="tag eco"><img src={leafIcon} alt="eco" className="inline-icon" /> {flight.co2Saving}</span> : null}
                          {index === 0 && activeTab === 'cheapest' ? <span className="tag best-price">Najtańszy</span> : null}
                          {flight.baggageType === 'checked' ? <span className="tag plain"><img src={bagageIcon} alt="bagaż" className="inline-icon" /> Wliczony bagaż 23kg</span> : null}
                        </div>
                      </div>

                      <div className="flight-timeline">
                        <div className="departure">
                          <h3>{flight.timeFrom}</h3>
                          <p>{flight.from}</p>
                        </div>
                        <div className="duration">
                          <p>{flight.duration}</p>
                          <div className="line">
                            <span className={`dot ${flight.stops > 0 ? 'stopover' : ''}`}></span>
                          </div>
                          <p className={`type ${flight.stops > 0 ? 'stopover' : ''}`}>{flight.type.toUpperCase()}</p>
                        </div>
                        <div className="arrival">
                          <h3>{flight.timeTo}</h3>
                          <p>{flight.to}</p>
                        </div>
                      </div>

                      <div className="rc-details-toggle">
                        <button className="btn-toggle" onClick={() => toggleExpandedFlight(flight.id)}>
                          {isExpanded ? 'Mniej szczegółów' : 'Szczegóły lotu'} <span className={`inline-icon ${isExpanded ? 'arrow-up' : 'arrow-down'}`}></span>
                        </button>
                      </div>
                    </div>

                    <div className="rc-pricing">
                      <h3 className="price">{flight.price}zł</h3>
                      <p className="price-desc">Zwykły bilet / os.</p>
                      <button className={index === 0 ? 'btn-select-main' : 'btn-select-outline'}>Wybierz</button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="rc-expanded-details">
                      <div className="timeline-vertical">
                        <div className="timeline-point">
                          <span className="time-dot"></span>
                          <div className="point-info">
                            <h4>Wylot • {flight.timeFrom}</h4>
                            <p>{flight.originLabel}</p>
                          </div>
                        </div>

                        <div className="timeline-travel">
                          <span>{flight.flightNumber}</span>
                          <span><img src={bagageIcon} alt="bagaż" className="inline-icon" /> {flight.baggageLabel}</span>
                          <span><img src={brightIcon} alt="klasa" className="inline-icon" /> Klasa ekonomiczna</span>
                        </div>

                        <div className="timeline-point">
                          <span className="time-dot"></span>
                          <div className="point-info">
                            <h4>Przylot • {flight.timeTo}</h4>
                            <p>{flight.destinationLabel}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="btn-load-more-container">
            <button className="btn-load-more">↻ Pokaż więcej wyników (24)</button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default SearchResults;
