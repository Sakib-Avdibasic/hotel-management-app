'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import db from './db.js';

import routerRoom from './routes/room.js';
import routerReservation from './routes/reservation.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/countries', (req, res) => {
	db.query('SELECT id, name FROM country', (err, result) => {
		if (err) res.status(500).send(err);
		else res.send(result);
	});
});

app.get('/guests', (req, res) => {
	db.query(
		'SELECT id, CONCAT(last_name, " ", first_name) AS name FROM guest ORDER BY last_name, first_name',
		(err, result) => {
			if (err) res.status(500).send(result);
			else res.send(result);
		}
	);
});

app.get('/:date', (req, res) => {
	const date = mysql.escape(req.params.date);

	let sql = `SELECT id,
  (SELECT reservation.id FROM reservation 
    WHERE reservation.room_id = room.id 
    AND reservation.arrival <= ${date}
    AND reservation.checkout > ${date}) AS reservation_id 
  FROM room ORDER BY id`;

	db.query(sql, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			const rooms = [];
			let i = 0;
			while (result && i < result.length) {
				// first digit of room id represents the floor the room is on
				rooms.push({ floor: String(result[i].id)[0], roomList: [] });

				const currentLastIdx = rooms.length - 1;
				do {
					rooms[currentLastIdx].roomList.push(result[i]);
					i++;
				} while (
					i < result.length &&
					String(result[i].id)[0] == String(result[i - 1].id)[0]
				);
			}
			res.send(rooms);
		}
	});
});

app.use('/room', routerRoom);
app.use('/reservation', routerReservation);

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
