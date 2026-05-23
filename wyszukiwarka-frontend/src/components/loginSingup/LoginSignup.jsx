import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser, registerUser } from '../../services/api';
import './LoginSignup.css';

import user_icon from '../asserts/person.svg';
import password_icon from '../asserts/password.svg';
import email_icon from '../asserts/email.svg';
import plane_icon from '../asserts/icons/plane-icon.svg';
import google_icon from '../asserts/icons/google.svg';
import facebook_icon from '../asserts/icons/facebook.svg';

const LoginSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const defaultAction = location.state?.action || 'Logowanie';
  const [action, setAction] = useState(defaultAction);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.action) {
      setAction(location.state.action);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (action === 'Logowanie') {
        const response = await loginUser({ email: formData.email, password: formData.password });
        login(response.token);
        navigate('/');
      } else {
        if (action === 'Rejestracja' && !termsAccepted) {
          setError('Musisz zaakceptować regulamin');
          setLoading(false);
          return;
        }
        await registerUser(formData);
        setAction('Logowanie'); // Po udanej rejestracji zmień na logowanie
        alert('Konto zostało utworzone. Możesz się teraz zalogować.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}>
      <Link to="/" className="back-arrow" title="Powrót do strony głównej">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </Link>

      <div className="header-text">
        <img src={plane_icon} alt="" width="40" />
        <h1>Witaj w SkyFlyer</h1>
        <h2>Zaloguj się lub utwórz nowe konto</h2>
      </div>

      <div className="submit-container">
        <button type="button" className={action==="Logowanie"?"submit gray":"submit"} onClick={() => {setAction('Logowanie'); setError(null);}}>Logowanie</button>
        <button type="button" className={action==="Rejestracja"?"submit gray":"submit"} onClick={() => {setAction('Rejestracja'); setError(null);}}>Rejestracja</button>
        </div>

        <div className={action === "Rejestracja" ? "inputs grid" : "inputs"}>
          
          {action === "Rejestracja" &&
            <div className="input">
              <label>Imię i nazwisko</label>
              <div className="input-text">
                <img src={user_icon} alt=""/>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jan Kowalski" />
              </div>
            </div>
          }
          
          <div className="input">
            <label>E-mail</label>
              <div className="input-text">
                <img src={email_icon} alt=""/>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="twoj@email.com" />
              </div>
          </div>
          
          <div className="input">
            <label>Hasło</label>
              <div className="input-text">
                <img src={password_icon} alt=""/>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={action === "Logowanie" ? "Wpisz hasło" : "Minimum 8 znaków"} />
              </div>
          </div>

          {action !== "Logowanie" &&
            <div className="input">
              <label>Powtórz hasło</label>
              <div className="input-text">
                <img src={password_icon} alt=""/>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Wpisz ponownie" />
              </div>
            </div>}
        </div>

        {action === "Rejestracja" ? 
          <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">Akceptuję <span>regulamin</span> oraz politykę <span>prywatności</span></label>
          </div>:

          <div className="remember-me">
              <div className="remember-left">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Zapamiętaj mnie</label>
              </div>
              <span className="forgot">Zapomniałeś hasła?</span>
        </div>}

        {error && <div className="error-message" style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>{error}</div>}

        <button type="button" className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Wczytywanie..." : (action === "Logowanie" ? "Zaloguj się" : "Utwórz konto")}
        </button>

        <div className="diffrent-login-options">
          <div className="line"></div>
          {action === "Logowanie" ? (
            <h2 className="between-line-text">Lub zaloguj przez</h2>
          ) : (
            <h2 className="between-line-text">Lub zarejestruj przez</h2>
          )}
          <div className="line"></div>
        </div> 

        <div className="social-icons">
          <div className="icon google">
              <img src={google_icon} alt="" width="30" />
              <label>Google</label>
          </div>
          <div className="icon facebook">
              <img src={facebook_icon} alt="" width="30" />
              <label>Facebook</label>
          </div>
        </div>

        <div className="no-account">
          {action === "Logowanie" ? (
            <p>Nie masz konta? <span onClick={() => setAction('Rejestracja')}>Zarejestruj się</span></p>
          ) : (
            <p>Masz już konto? <span onClick={() => setAction('Logowanie')}>Zaloguj się</span></p>
          )}
        </div>
    </div>
  );
};

export default LoginSignup;