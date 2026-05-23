import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home/Home'
import LoginSignup from './components/loginSingup/LoginSignup'
import ManageBooking from './pages/ManageBooking/ManageBooking'
import SearchResults from './pages/SearchResults/SearchResults'
import CheckIn from './pages/CheckIn/CheckIn'
import Offers from './pages/Offers/Offers'
import ProtectedRoute from './context/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logowanie" element={<LoginSignup />} />
          <Route path="/zarzadzaj-rezerwacja" element={<ProtectedRoute><ManageBooking /></ProtectedRoute>} />
          <Route path="/wyniki-wyszukiwania" element={<SearchResults />} />
          <Route path="/odprawa" element={<CheckIn />} />
          <Route path="/oferty" element={<Offers />} />
        </Routes>
      </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
