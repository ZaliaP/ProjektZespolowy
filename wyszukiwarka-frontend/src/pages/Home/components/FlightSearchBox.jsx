import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightSearchBox.css';
import userIcon from '../../../components/asserts/user.svg';
import placeIcon from '../../../components/asserts/place.svg';
import calendarIcon from '../../../components/asserts/calendar.svg';
import downArrowIcon from '../../../components/asserts/downarrow.svg';
import { buildSearchQuery, getRecentSearches, saveRecentSearch } from '../../../utils/searchStorage';

const FlightSearchBox = () => {
  const cabinClassOptions = [
    { value: 'economy', label: 'Klasa Ekonomiczna' },
    { value: 'premium', label: 'Premium Economy' },
    { value: 'business', label: 'Klasa Biznes' },
    { value: 'first', label: 'Pierwsza Klasa' },
  ];

  const [tripType, setTripType] = useState('roundTrip');
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [dateOut, setDateOut] = useState('');
  const [dateReturn, setDateReturn] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  
  const navigate = useNavigate();
  const dateOutRef = useRef(null);
  const dateReturnRef = useRef(null);
  const passengersRef = useRef(null);
  const classRef = useRef(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (passengersRef.current && !passengersRef.current.contains(event.target)) {
        setIsPassengersOpen(false);
      }

      if (classRef.current && !classRef.current.contains(event.target)) {
        setIsClassOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (search) => {
    const updatedSearches = saveRecentSearch(search);
    setRecentSearches(updatedSearches);
    navigate(`/wyniki-wyszukiwania?${buildSearchQuery(search)}`);
  };

  const handleSearch = () => {
    const normalizedOrigin = origin.trim().toUpperCase();
    const normalizedDest = dest.trim().toUpperCase();

    if (!normalizedOrigin || !normalizedDest) {
      setErrorMessage('Uzupełnij lotnisko wylotu i przylotu.');
      return;
    }

    if (normalizedOrigin === normalizedDest) {
      setErrorMessage('Miejsce wylotu i przylotu nie może być takie samo.');
      return;
    }

    if (!dateOut) {
      setErrorMessage('Wybierz datę wylotu.');
      return;
    }

    if (tripType === 'roundTrip' && !dateReturn) {
      setErrorMessage('Wybierz datę powrotu.');
      return;
    }

    if (tripType === 'roundTrip' && dateReturn < dateOut) {
      setErrorMessage('Data powrotu nie może być wcześniejsza niż data wylotu.');
      return;
    }

    setErrorMessage('');
    executeSearch({
      origin: normalizedOrigin,
      dest: normalizedDest,
      dateOut,
      dateReturn,
      tripType,
      passengers,
      cabinClass,
    });
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(dest);
    setDest(temp);
  };

  const applyRecentSearch = (search) => {
    setTripType(search.tripType || 'roundTrip');
    setOrigin(search.origin || '');
    setDest(search.dest || '');
    setDateOut(search.dateOut || '');
    setDateReturn(search.dateReturn || '');
    setPassengers(search.passengers || 1);
    setCabinClass(search.cabinClass || 'economy');
    setErrorMessage('');
  };

  const passengerLabel = `${passengers} ${passengers === 1 ? 'pasażer' : passengers < 5 ? 'pasażerów' : 'pasażerów'}`;
  const cabinClassLabel = cabinClassOptions.find((option) => option.value === cabinClass)?.label || 'Klasa Ekonomiczna';
  
  return (
    <div className="search-box-container">
      <div className="search-options">
        <div className="trip-types">
          <label className="radio-label">
            <input 
              type="radio" 
              name="tripType" 
              value="roundTrip" 
              checked={tripType === 'roundTrip'}
              onChange={(e) => setTripType(e.target.value)} 
            />
            <span className="radio-custom"></span>
            W dwie strony
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="tripType" 
              value="oneWay" 
              checked={tripType === 'oneWay'}
              onChange={(e) => setTripType(e.target.value)} 
            />
            <span className="radio-custom"></span>
            W jedną stronę
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="tripType" 
              value="multiCity" 
              checked={tripType === 'multiCity'}
              onChange={(e) => setTripType(e.target.value)} 
            />
            <span className="radio-custom"></span>
            Wiele miast
          </label>
        </div>

        <div className="other-options">
          <div className="dropdown-control" ref={passengersRef}>
            <button
              type="button"
              className="passengers-select control-trigger"
              onClick={() => {
                setIsPassengersOpen((current) => !current);
                setIsClassOpen(false);
              }}
            >
              <img src={userIcon} alt="Pasażer" className="inline-svg-icon" />
              <span>{passengerLabel}</span>
              <img src={downArrowIcon} alt="rozwiń" className={`dropdown-svg-icon ${isPassengersOpen ? 'open' : ''}`} />
            </button>

            {isPassengersOpen ? (
              <div className="dropdown-panel passengers-panel">
                <div className="dropdown-counter-row">
                  <span>Pasażerowie</span>
                  <div className="counter-controls">
                    <button type="button" onClick={() => setPassengers((current) => Math.max(1, current - 1))}>-</button>
                    <strong>{passengers}</strong>
                    <button type="button" onClick={() => setPassengers((current) => Math.min(9, current + 1))}>+</button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="dropdown-control" ref={classRef}>
            <button
              type="button"
              className="class-select control-trigger"
              onClick={() => {
                setIsClassOpen((current) => !current);
                setIsPassengersOpen(false);
              }}
            >
              <span>{cabinClassLabel}</span>
              <img src={downArrowIcon} alt="rozwiń" className={`dropdown-svg-icon ${isClassOpen ? 'open' : ''}`} />
            </button>

            {isClassOpen ? (
              <div className="dropdown-panel class-panel">
                {cabinClassOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`dropdown-option ${cabinClass === option.value ? 'active' : ''}`}
                    onClick={() => {
                      setCabinClass(option.value);
                      setIsClassOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="search-inputs">
        <div className="input-group location-group">
          <img src={placeIcon} alt="Miejsce" className="input-svg-icon" />
          <input type="text" placeholder="Skąd lecisz?" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          <button className="swap-btn" onClick={handleSwap}>
            <span className="swap-icon-text">⇄</span>
          </button>
        </div>
        
        <div className="input-group location-group">
          <img src={placeIcon} alt="Miejsce" className="input-svg-icon" />
          <input type="text" placeholder="Dokąd lecisz?" value={dest} onChange={(e) => setDest(e.target.value)} />
        </div>

        <div className="input-group date-group" onClick={() => dateOutRef.current && dateOutRef.current.showPicker()}>
          <img src={calendarIcon} alt="Kalendarz" className="input-svg-icon" />
          <input 
            type={dateOut ? "date" : "text"}
            placeholder="Wylot"
            onFocus={(e) => { e.target.type = "date"; e.target.showPicker && e.target.showPicker(); }}
            onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
            ref={dateOutRef}
            value={dateOut} 
            onChange={(e) => setDateOut(e.target.value)} 
            className="custom-date-input"
          />
        </div>

        {tripType === 'roundTrip' && (
          <div className="input-group date-group" onClick={() => dateReturnRef.current && dateReturnRef.current.showPicker()}>
            <img src={calendarIcon} alt="Kalendarz" className="input-svg-icon" />
            <input 
              type={dateReturn ? "date" : "text"}
              placeholder="Powrót"
              onFocus={(e) => { e.target.type = "date"; e.target.showPicker && e.target.showPicker(); }}
              onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
              ref={dateReturnRef}
              value={dateReturn} 
              onChange={(e) => setDateReturn(e.target.value)} 
              className="custom-date-input"
            />
          </div>
        )}
      </div>
      <div className="search-box-bottom-row">
        <button className="search-btn" onClick={handleSearch}>Szukaj lotów</button>
      </div>

      {errorMessage ? <p className="search-feedback search-feedback-error">{errorMessage}</p> : null}

      {recentSearches.length > 0 ? (
        <div className="recent-searches">
          <p className="recent-searches-label">Ostatnie wyszukiwania</p>
          <div className="recent-searches-list">
            {recentSearches.map((search, index) => (
              <button
                key={`${search.origin}-${search.dest}-${search.dateOut}-${index}`}
                type="button"
                className="recent-search-chip"
                onClick={() => applyRecentSearch(search)}
              >
                <span>{search.origin} - {search.dest}</span>
                <small>{search.dateOut}{search.tripType === 'roundTrip' && search.dateReturn ? ` • ${search.dateReturn}` : ''} • {search.passengers || 1} os.</small>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FlightSearchBox;