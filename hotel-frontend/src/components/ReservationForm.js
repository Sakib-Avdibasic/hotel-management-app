import './ReservationForm.css';
import { useState } from 'react';
import axios from '../axios.js';
import { formatDate, handleWarning } from '../utils.js';
import { useNavigate } from 'react-router-dom';

let selectableCountries = [];
axios
	.get('/countries')
	.then(response => (selectableCountries = response.data))
	.catch(err => console.log(err.response));
let guestNames = [];

const ReservationForm = ({ roomId, capacity }) => {
	const [arrival, setArrival] = useState(formatDate(new Date()));
	const [checkout, setCheckout] = useState(
		formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))
	);
	const [adultCount, setAdultCount] = useState(1);
	const [childCount, setChildCount] = useState('');
	const [fName, setFName] = useState('');
	const [lName, setLName] = useState('');
	const [phone, setPhone] = useState('');
	const [country, setCountry] = useState('');
	const [city, setCity] = useState('');
	const [street, setStreet] = useState('');
	const [zipCode, setZipCode] = useState('');
	const [guestId, setGuestId] = useState('');

	const [existingGuest, setExistingGuest] = useState(false);
	const [warning, setWarning] = useState('');
	const [showWarning, setShowWarning] = useState(false);

	const navigate = useNavigate();

	const handleGuestAmount = e => {
		const fieldChanged = e.target.name;
		const enteredValue = +e.target.value;

		if (fieldChanged == 'adult_count') {
			if (enteredValue < 1) {
				handleWarning(
					setShowWarning,
					setWarning,
					'At least 1 of the guests must be an adult'
				);
				return;
			}
		} else {
			if (enteredValue < 0) return;
		}

		const guestsBooked =
			(fieldChanged == 'adult_count' ? +childCount : adultCount) + enteredValue;
		if (guestsBooked > capacity) {
			const excess = guestsBooked - capacity;
			if (fieldChanged == 'adult_count') setAdultCount(enteredValue - excess);
			else setChildCount(enteredValue - excess);

			handleWarning(
				setShowWarning,
				setWarning,
				`Maximum number of guests for this room is ${capacity}`
			);
		} else {
			if (fieldChanged == 'adult_count') setAdultCount(enteredValue);
			else setChildCount(enteredValue);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();

		const formData = {
			room_id: roomId,
			capacity: capacity,
			arrival: arrival,
			checkout: checkout,
			adult_count: adultCount,
			child_count: +childCount,
		};
		if (existingGuest) formData.guest_id = guestId;
		else {
			formData.fname = fName;
			formData.lname = lName;
			formData.phone = phone;
			formData.country = country;
			formData.city = city;
			formData.street = street;
			formData.zip_code = zipCode;
		}

		for (const param of Object.values(formData)) {
			if (param === '')
				return handleWarning(
					setShowWarning,
					setWarning,
					'Please fill out all fields'
				);
		}

		axios
			.post('/reservation', formData)
			.then(response => {
				const data = response.data;
				navigate(`/reservation/${data[0].reserv_id}`);
			})
			.catch(err =>
				handleWarning(setShowWarning, setWarning, err.response.data)
			);
	};

	return (
		<section className="room-reservation">
			<div>
				<h2>Book reservation</h2>
				<button
					onClick={() => {
						setExistingGuest(!existingGuest);
						if (guestNames == '') {
							axios
								.get('/guests')
								.then(response => {
									guestNames = response.data;
									setGuestId(response.data[0].id);
								})
								.catch(err => console.log(err));
						}
					}}
				>
					{existingGuest ? 'New guest' : 'Previous guest'}
				</button>
			</div>
			<form autoComplete="off" onSubmit={handleSubmit}>
				<section className="short-input-section">
					<div className="input-box">
						<label htmlFor="arrival">Arrival</label>
						<input
							type="date"
							name="arrival"
							id="arrival"
							value={arrival}
							onChange={e => {
								const chosenArrival = new Date(e.target.value);
								if (chosenArrival >= new Date(checkout)) {
									setCheckout(
										formatDate(
											new Date(
												chosenArrival.setDate(chosenArrival.getDate() + 1)
											)
										)
									);
								}
								setArrival(e.target.value);
							}}
						></input>
					</div>
					<div className="input-box">
						<label htmlFor="checkout">Checkout</label>
						<input
							type="date"
							name="checkout"
							id="checkout"
							value={checkout}
							onChange={e => {
								const chosenCheckout = new Date(e.target.value);
								if (chosenCheckout <= new Date(arrival)) {
									setArrival(
										formatDate(
											new Date(
												chosenCheckout.setDate(chosenCheckout.getDate() - 1)
											)
										)
									);
								}
								setCheckout(e.target.value);
							}}
						></input>
					</div>
					<div className="input-box">
						<label htmlFor="adult_count">No. of adults</label>
						<input
							type="number"
							name="adult_count"
							id="adult_count"
							value={adultCount}
							onChange={handleGuestAmount}
						></input>
					</div>
					<div className="input-box">
						<label htmlFor="child_count">No. of children</label>
						<input
							type="number"
							name="child_count"
							id="child_count"
							value={childCount}
							onChange={handleGuestAmount}
						></input>
					</div>
				</section>
				<section>
					{existingGuest ? (
						<div className="input-box">
							<label htmlFor="country">Guest</label>
							<select
								id="guest_id"
								name="guest_id"
								value={guestId}
								onChange={e => setGuestId(+e.target.value)}
							>
								{guestNames.map(guest => {
									return (
										<option key={guest.id} value={guest.id}>
											{guest.name}
										</option>
									);
								})}
							</select>
						</div>
					) : (
						<>
							<div className="input-box">
								<label htmlFor="fname">First name</label>
								<input
									type="text"
									name="fname"
									id="fname"
									value={fName}
									onChange={e => setFName(e.target.value)}
								></input>
							</div>
							<div className="input-box">
								<label htmlFor="lname">Last name</label>
								<input
									type="text"
									name="lname"
									id="lname"
									value={lName}
									onChange={e => setLName(e.target.value)}
								></input>
							</div>
							<div className="input-box">
								<label htmlFor="phone">Phone</label>
								<input
									type="tel"
									name="phone"
									id="phone"
									value={phone}
									onChange={e => setPhone(e.target.value)}
								></input>
							</div>
							<div className="input-box">
								<label htmlFor="country">Country</label>
								<select
									id="country"
									name="country"
									value={country}
									onChange={e => setCountry(e.target.value)}
								>
									{selectableCountries.map(country => (
										<option key={country.id} value={country.id}>
											{country.name}
										</option>
									))}
								</select>
							</div>
							<div className="input-box">
								<label htmlFor="city">City</label>
								<input
									type="text"
									name="city"
									id="city"
									value={city}
									onChange={e => setCity(e.target.value)}
								></input>
							</div>
							<div className="input-box">
								<label htmlFor="street">Street</label>
								<input
									type="text"
									name="street"
									id="street"
									value={street}
									onChange={e => setStreet(e.target.value)}
								></input>
							</div>
							<div className="input-box">
								<label htmlFor="zip_code">Postal code</label>
								<input
									type="text"
									name="zip_code"
									id="zip-code"
									value={zipCode}
									onChange={e => setZipCode(e.target.value)}
								></input>
							</div>
						</>
					)}
				</section>
				<button>Book</button>
			</form>
			{showWarning ? <div className="warning">{warning}</div> : ''}
		</section>
	);
};

export default ReservationForm;
