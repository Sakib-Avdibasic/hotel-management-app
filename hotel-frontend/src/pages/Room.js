import './Room.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../axios.js';
import ReservationForm from '../components/ReservationForm';

let bedAmount = '';
const formatCapacity = (bed_s, bed_d) => {
	let output = '';

	if (bed_s > 0) {
		output += `${bed_s}x1`;
		if (bed_d > 0) output += ` + `;
	}
	if (bed_d > 0) output += `${bed_d}x2`;

	return output;
};

const RoomPage = () => {
	const [roomInfo, setRoomInfo] = useState({});
	const { id } = useParams();

	useEffect(() => {
		axios
			.get(`/room/${id}`)
			.then(response => {
				const data = response.data;
				setRoomInfo(data);
				bedAmount = formatCapacity(data.bed_single, data.bed_double);
			})
			.catch(err => console.log(err.response));
	}, [id]);

	return (
		<main className="room-page-container">
			<h1>{roomInfo.id}</h1>
			<section className="info-section room-info">
				<h2>Details</h2>
				<ul>
					<li>
						Capacity: &nbsp;
						<span>
							{roomInfo.bed_single * 1 + roomInfo.bed_double * 2} ({bedAmount})
						</span>
					</li>
					<li>
						Bar: <span>{roomInfo.bar ? 'Yes' : 'No'}</span>
					</li>
					<li>
						Smoking: <span>{roomInfo.smoking ? 'Yes' : 'No'}</span>
					</li>
					<li>
						Bathroom: <span>{roomInfo.bathroom_type}</span>
					</li>
					<li>
						Price: <span>${roomInfo.price}</span>
					</li>
				</ul>
			</section>
			<ReservationForm
				roomId={id}
				capacity={roomInfo.bed_single * 1 + roomInfo.bed_double * 2}
			/>
		</main>
	);
};

export default RoomPage;
