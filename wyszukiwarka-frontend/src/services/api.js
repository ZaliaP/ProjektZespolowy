import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Możemy dodać interceptory np. do dołączania tokenu JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchFlights = async (params) => {
  // Symulacja działania dla Django
  // return await api.get('/flights', { params });
  
  // Na ten moment mockujemy:
  return new Promise((resolve) => setTimeout(() => resolve([
    {
      id: 1,
      airline: 'Wizz Air',
      airlineKey: 'wizz',
      from: params.origin || 'WAW',
      to: params.dest || 'LHR',
      originLabel: 'Warszawa, Lotnisko Chopina (WAW)',
      destinationLabel: 'Londyn, Luton Airport (LTN)',
      date: params.dateOut,
      price: 199,
      timeFrom: '14:20',
      timeTo: '16:15',
      duration: '1h 55m',
      durationMinutes: 115,
      type: 'Bezpośredni',
      stops: 0,
      baggageType: 'personal',
      baggageLabel: 'Tylko przedmioty osobiste',
      flightNumber: 'W6 1301 (Airbus A320)',
      co2Saving: '-18% CO2',
    },
    {
      id: 2,
      airline: 'LOT Polish Airlines',
      airlineKey: 'lot',
      from: params.origin || 'WAW',
      to: params.dest || 'LHR',
      originLabel: 'Warszawa, Lotnisko Chopina (WAW)',
      destinationLabel: 'Londyn, Heathrow Airport (LHR)',
      date: params.dateOut,
      price: 450,
      timeFrom: '08:00',
      timeTo: '09:45',
      duration: '1h 45m',
      durationMinutes: 105,
      type: 'Bezpośredni',
      stops: 0,
      baggageType: 'checked',
      baggageLabel: 'Wliczony bagaż podręczny',
      flightNumber: 'LO 281 (Boeing 737 MAX)',
      co2Saving: '',
    },
    {
      id: 3,
      airline: 'Lufthansa',
      airlineKey: 'lufthansa',
      from: params.origin || 'WAW',
      to: params.dest || 'LHR',
      originLabel: 'Warszawa, Lotnisko Chopina (WAW)',
      destinationLabel: 'Londyn, Heathrow Airport (LHR)',
      date: params.dateOut,
      price: 820,
      timeFrom: '10:00',
      timeTo: '13:20',
      duration: '4h 20m',
      durationMinutes: 260,
      type: '1 Przesiadka',
      stops: 1,
      baggageType: 'checked',
      baggageLabel: 'Bagaż rejestrowany 23 kg',
      flightNumber: 'LH 1353 + LH 910',
      co2Saving: '',
    },
    {
      id: 4,
      airline: 'Ryanair',
      airlineKey: 'ryanair',
      from: params.origin || 'WAW',
      to: params.dest || 'LHR',
      originLabel: 'Warszawa Modlin (WMI)',
      destinationLabel: 'Londyn, Stansted Airport (STN)',
      date: params.dateOut,
      price: 285,
      timeFrom: '19:15',
      timeTo: '21:05',
      duration: '1h 50m',
      durationMinutes: 110,
      type: 'Bezpośredni',
      stops: 0,
      baggageType: 'cabin',
      baggageLabel: 'Bagaż podręczny 10 kg',
      flightNumber: 'FR 1881 (Boeing 737)',
      co2Saving: '-12% CO2',
    },
    {
      id: 5,
      airline: 'LOT Polish Airlines',
      airlineKey: 'lot',
      from: params.origin || 'WAW',
      to: params.dest || 'LHR',
      originLabel: 'Warszawa, Lotnisko Chopina (WAW)',
      destinationLabel: 'Londyn, Heathrow Airport (LHR)',
      date: params.dateOut,
      price: 1200,
      timeFrom: '06:10',
      timeTo: '15:40',
      duration: '8h 30m',
      durationMinutes: 510,
      type: '2+ przesiadki',
      stops: 2,
      baggageType: 'checked',
      baggageLabel: 'Bagaż rejestrowany 23 kg',
      flightNumber: 'LO 391 + LO 745 + LO 287',
      co2Saving: '',
    }
  ]), 800));
};

export const loginUser = async (credentials) => {
  // docelowo: return await api.post('/auth/login', credentials);
  return new Promise((resolve) => setTimeout(() => resolve({ token: 'mock-jwt-token-123' }), 500));
};

export const registerUser = async (userData) => {
  // docelowo: return await api.post('/auth/register', userData);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
};

export default api;