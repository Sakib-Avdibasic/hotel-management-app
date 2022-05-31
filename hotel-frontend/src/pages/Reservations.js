import './Reservations.css';
import { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Link, useSearchParams } from 'react-router-dom';
import { handleWarning, localizeDate } from '../utils';
import axios from '../axios.js';

library.add(faCalendar);

const Reservations = () => {
	const [reservations, setReservations] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [fName, setFName] = useState(searchParams.get('fname') || '');
	const [lName, setLName] = useState(searchParams.get('lname') || '');

	const [warning, setWarning] = useState('');
	const [showWarning, setShowWarning] = useState(false);

	const setParams = e => {
		e.preventDefault();
		if (fName || lName) setSearchParams({ lname: lName, fname: fName });
	};

	useEffect(() => {
		if (!fName && !lName) return;

		axios
			.get(
				`/reservation/search?${fName ? `fname=${fName}&` : ''}${
					lName ? `lname=${lName}` : ''
				}`
			)
			.then(response => {
				const data = response.data;
				setReservations(data);
			})
			.catch(err =>
				handleWarning(setShowWarning, setWarning, err.response.data)
			);
	}, [searchParams]);

	return (
		<main>
			<form
				className="search-form horizontal"
				autoComplete="off"
				onSubmit={setParams}
			>
				<div className="input-box">
					<label htmlFor="lname">Last name</label>
					<input
						type="text"
						name="lname"
						id="lname"
						placeholder="Perić"
						value={lName}
						onChange={e => setLName(e.target.value)}
					/>
				</div>
				<div className="input-box">
					<label htmlFor="fname">First name</label>
					<input
						type="text"
						name="fname"
						id="fname"
						placeholder="Pero"
						value={fName}
						onChange={e => setFName(e.target.value)}
					/>
				</div>
				<button className="search-btn">Search</button>
			</form>
			<h2 className="result-list-title">Reservations</h2>
			<ul className="result-list">
				{reservations != '' ? (
					reservations.map((reservation, idx) => {
						return (
							<div
								className="reservation-group"
								style={{
									animationDelay: `${idx * 0.1}s`,
								}}
								key={idx}
							>
								<h3>{reservation.guest}</h3>
								{reservation.reservList.map(reservation => {
									return (
										<li className="search-result" key={reservation.id}>
											<FontAwesomeIcon icon="calendar" />
											<span>
												{localizeDate(new Date(reservation.arrival))} -{' '}
												{localizeDate(new Date(reservation.checkout))}
											</span>
											<Link
												to={`/reservation/${reservation.id}`}
												className="reserv-link"
											>
												More...
											</Link>
										</li>
									);
								})}
							</div>
						);
					})
				) : (
					<p>No results</p>
				)}
			</ul>
			{showWarning ? <div className="warning">{warning}</div> : ''}
		</main>
	);
};

export default Reservations;
