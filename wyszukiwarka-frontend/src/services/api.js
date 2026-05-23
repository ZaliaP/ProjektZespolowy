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


//przykładowi użytkownicy
const MOCK_USERS = [
  { id: 1, name: 'Jan Kowalski', email: 'jan@test.pl', password: 'haslo123' },
];

export const loginUser = async ({ email, password }) => {
  await new Promise(res => setTimeout(res, 500));

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) throw { response: { data: { message: 'Nieprawidłowy email lub hasło' } } };

  return { token: `mock-token-${user.id}` };
};

export const registerUser = async ({ name, email, password, confirmPassword }) => {
  await new Promise(res => setTimeout(res, 500));

  if (!name || !email || !password)
    throw { response: { data: { message: 'Wypełnij wszystkie pola' } } };

  if (password !== confirmPassword)
    throw { response: { data: { message: 'Hasła nie są zgodne' } } };

  if (password.length < 8)
    throw { response: { data: { message: 'Hasło musi mieć minimum 8 znaków' } } };

  if (MOCK_USERS.find(u => u.email === email))
    throw { response: { data: { message: 'Ten email jest już zajęty' } } };

  MOCK_USERS.push({ id: Date.now(), name, email, password });
  return { success: true };
};

//mocki rezerwacji 
const MOCK_BOOKINGS = [
  {
    id: 'A92BCK',
    status: 'confirmed',
    airline: 'Wizz Air',
    from: 'WAW', to: 'LTN',
    timeFrom: '14:20', timeTo: '16:15',
    duration: '1h 55m',
    type: 'Bezpośredni',
    passenger: [{ name: 'Jan Kowalski', type: 'Dorosły', initials: 'J', seat: null }],
    takenSeats: ['1A', '1B', '2C', '3F', '5A', '5B', '5C', '5D', '5E', '5F', '7C', '8D', '10A', '12B'],
    airlineInitial: 'W',   
    points: '1,450',
    baggage: 'Tylko mały plecak',
    checkInDaysLeft: 10,
  },
  {
    id: 'B31XYZ',
    status: 'confirmed',
    airline: 'LOT Polish Airlines',
    from: 'KRK', to: 'CDG',
    timeFrom: '08:00', timeTo: '10:30',
    duration: '2h 30m',
    type: 'Bezpośredni',
    passengers:[{ name: 'Jan Kowalski', type: 'Dorosły', initials: 'J', seat: '14A' }],
    takenSeats: ['14B'],
    airlineInitial: 'L',    
    points: '2,100',
    baggage: 'Bagaż podręczny 10 kg',
    checkInDaysLeft: 25,
  },
];

export const getUserBookings = async () => {
  await new Promise(res => setTimeout(res, 600));
  return MOCK_BOOKINGS;
  // docelowo: return await api.get('/bookings').then(r => r.data);
};

export default api;