import './Home.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../axios.js';
import { formatDate } from '../utils.js';

const Home = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const date = searchParams.get('date');
	const [rooms, setRooms] = useState([]);

	const changeDate = direction => {
		const newDate = date ? new Date(date) : new Date();
		direction == -1
			? newDate.setDate(newDate.getDate() - 1)
			: newDate.setDate(newDate.getDate() + 1);
		setSearchParams({ date: formatDate(newDate) });
	};

	useEffect(() => {
		axios
			.get(`/${date || formatDate(new Date())}`)
			.then(response => {
				setRooms(response.data);
			})
			.catch(err => console.log(err));
	}, [date]);

	return (
		<main>
			<section className="date-picker">
				<button
					className="date-changer"
					title="yesterday"
					onClick={() => changeDate(-1)}
				>
					&lt;
				</button>
				<input
					type="date"
					name="selectedDate"
					id="selectedDate"
					value={date || formatDate(new Date())}
					onChange={e => setSearchParams({ date: e.target.value })}
				></input>
				<button
					className="date-changer"
					title="tomorrow"
					onClick={() => changeDate(1)}
				>
					&gt;
				</button>
			</section>
			{rooms.map(roomGroup => {
				return (
					<section className="room-category" key={roomGroup.floor}>
						<h2>Floor {roomGroup.floor}</h2>
						<div className="room-list">
							{roomGroup.roomList.map(room => {
								const { id, reservation_id } = room;
								return (
									<div className="room-container" key={id}>
										<Link
											to={`/room/${id}`}
											className={`room-link ${
												reservation_id ? 'reserved' : ''
											}`}
										>
											<span className="room-no">{id}</span>
										</Link>
										{reservation_id ? (
											<Link to={`/reservation/${reservation_id}`}>
												Reservation
											</Link>
										) : (
											''
										)}
									</div>
								);
							})}
						</div>
					</section>
				);
			})}
		</main>
	);
};

export default Home;
