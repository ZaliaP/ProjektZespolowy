import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import logoIcon from '../asserts/logo.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <img src={logoIcon} alt="SkyFlyer Logo" className="logo-icon-img" />
            <span className="logo-text">SkyFlyer</span>
          </Link>
        </div>
        
        <ul className="navbar-links">
          <li><NavLink to="/" end>Strona Główna</NavLink></li>
          <li><a href="#">Oferty</a></li>
          <li><a href="#">Odprawa</a></li>
          <li><NavLink to="/zarzadzaj-rezerwacja">Zarządzaj rezerwacją</NavLink></li>
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <button className="btn-logout" onClick={handleLogout}>Wyloguj się</button>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/logowanie', { state: { action: 'Logowanie' } })}>Zaloguj się</button>
              <button className="btn-register" onClick={() => navigate('/logowanie', { state: { action: 'Rejestracja' } })}>Rejestracja</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;