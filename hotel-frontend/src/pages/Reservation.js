import './Reservation.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { formatDate, localizeDate, handleWarning } from '../utils';
import axios from '../axios.js';

const Reservation = () => {
	const { id } = useParams();
	const [reservInfo, setReservInfo] = useState({});
	const [showOverlay, setShowOverlay] = useState(false);
	const [shownPopup, setShownPopup] = useState('');
	const [arrival, setArrival] = useState('');
	const [checkout, setCheckout] = useState('');
	const navigate = useNavigate();

	const [warning, setWarning] = useState('');
	const [showWarning, setShowWarning] = useState(false);

	const cancelReserv = () => {
		axios
			.delete(`/reservation/${id}`)
			.then(() => {
				navigate('/');
			})
			.catch(err =>
				handleWarning(setShowWarning, setWarning, err.response.data)
			);
	};

	const updateReserv = () => {
		if (arrival == reservInfo.arrival && checkout == reservInfo.checkout)
			return;

		const roomId = reservInfo.room;

		axios
			.put(`/reservation/${id}`, { roomId, arrival, checkout })
			.then(response => {
				const data = response.data;
				window.location.reload();
			})
			.catch(err =>
				handleWarning(setShowWarning, setWarning, err.response.data)
			);
	};

	useEffect(() => {
		axios
			.get(`/reservation/${id}`)
			.then(response => {
				const data = response.data;
				setReservInfo(data);
				setArrival(data.arrival);
				setCheckout(data.checkout);
			})
			.catch(err => console.log(err));
	}, [id]);

	return (
		<main className="reserv-page-container">
			<section className="header-section">
				<button
					title="Promijeni termin"
					onClick={() => {
						setShowOverlay(true);
						setShownPopup('update');
					}}
				>
					Change
				</button>
				<h1>
					Reservation <span>#{String(id).padStart(3, '0')}</span>
				</h1>
				<button
					onClick={() => {
						setShowOverlay(true);
						setShownPopup('cancel');
					}}
				>
					Cancel
				</button>
			</section>
			<section className="about-section">
				<article className="info-section">
					<h2>Guest</h2>
					<ul>
						<li>
							Name: <span>{reservInfo.name}</span>
						</li>
						<li>
							Phone: <span>{reservInfo.phone}</span>
						</li>
						<li>
							Country: <span>{reservInfo.country}</span>
						</li>
						<li>
							Address: <span>{reservInfo.address}</span>
						</li>
					</ul>
				</article>
				<article className="info-section reserv-info">
					<h2>Reservation</h2>
					<ul>
						<li>
							Period:{' '}
							<span>
								{`${localizeDate(
									new Date(reservInfo.arrival)
								)} - ${localizeDate(new Date(reservInfo.checkout))}`}
							</span>
						</li>
						<li>
							Room:{' '}
							<span>
								<Link to={`/room/${reservInfo.room}`}>{reservInfo.room}</Link>
							</span>
						</li>
						<li>
							No. of adults: <span>{reservInfo.adult_count}</span>
						</li>
						{reservInfo.child_count ? (
							<li>
								No. of children: <span>{reservInfo.child_count}</span>
							</li>
						) : (
							''
						)}
						<li>
							Total price: <span>${`${reservInfo.price}`}</span>
						</li>
					</ul>
				</article>
			</section>
			{showOverlay ? (
				<Modal
					title={
						shownPopup == 'cancel'
							? 'Are you sure you want to cancel the reservation?'
							: 'Reservation period update'
					}
					body={
						shownPopup == 'cancel' ? (
							<>
								<button
									className="btn-deny"
									onClick={() => {
										setShowOverlay(false);
										setShownPopup('');
									}}
								>
									No
								</button>
								<button className="btn-confirm" onClick={cancelReserv}>
									Yes, cancel reservation
								</button>
							</>
						) : (
							<>
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
															chosenCheckout.setDate(
																chosenCheckout.getDate() - 1
															)
														)
													)
												);
											}
											setCheckout(e.target.value);
										}}
									></input>
								</div>
								<button onClick={updateReserv}>Confirm</button>
							</>
						)
					}
					onclose={() => {
						setShowOverlay(false);
						setShownPopup('');
					}}
				/>
			) : (
				''
			)}
			{showWarning ? <div className="warning">{warning}</div> : ''}
		</main>
	);
};

export default Reservation;
