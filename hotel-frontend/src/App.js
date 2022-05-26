import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Room from './pages/Room';
import Reservations from './pages/Reservations';
import Reservation from './pages/Reservation';

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/room/:id" element={<Room />} />
				<Route path="/reservations" element={<Reservations />} />
				<Route path="reservation/:id" element={<Reservation />} />
			</Routes>
			<Footer />
		</Router>
	);
}

export default App;
