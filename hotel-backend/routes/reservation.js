import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import db from '../db.js';

const router = express.Router();

const checkTaken = async (roomId, from, to, res, clause = '') => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT 1 FROM reservation WHERE room_id = ${mysql.escape(
			+roomId
		)} AND (${mysql.escape(from)} < checkout AND ${mysql.escape(
			to
		)} > arrival)${clause}`;

		db.query(sql, (err, result) => {
			if (err) {
				res.status(500).send(err);
			} else if (result.length > 0) reject();
			else resolve();
		});
	});
};

const insertReserv = (
	arrival,
	checkout,
	adultCount,
	childCount,
	roomId,
	res,
	guestId = null
) => {
	db.query(
		'INSERT INTO reservation VALUES (null, ?, ?, ?, ?, ?, COALESCE(?, (SELECT LAST_INSERT_ID())))',
		[arrival, checkout, adultCount, childCount, roomId, guestId],
		(err, result) => {
			if (err) res.status(500).send(err);
			else {
				db.query('SELECT LAST_INSERT_ID() AS reserv_id', (err, result) => {
					if (err) res.status(500).send(err);
					else res.status(201).send(result);
				});
			}
		}
	);
};

router.get('/search', (req, res) => {
	const fName = req.query.fname;
	const lName = req.query.lname;

	if (!fName && !lName)
		return res.status(400).send('No search parameters given');

	let whereClause;
	if (!fName) whereClause = `g.last_name = ${mysql.escape(lName)}`;
	else if (!lName) whereClause = `g.first_name = ${mysql.escape(fName)}`;
	else
		whereClause = `g.first_name = ${mysql.escape(
			fName
		)} AND g.last_name = ${mysql.escape(lName)}`;

	db.query(
		`SELECT r.id, r.arrival, r.checkout, CONCAT(g.last_name, ' ', g.first_name) AS guest 
    FROM reservation r 
    JOIN guest g ON r.guest_id = g.id 
    WHERE ${whereClause} 
    ORDER BY g.last_name, g.first_name, r.arrival DESC`,
		(err, result) => {
			if (err) res.status(500).send(err);
			else {
				const reservations = [];
				let i = 0;
				while (result && i < result.length) {
					reservations.push({
						guest: result[i].guest,
						reservList: [],
					});

					const currentLastIdx = reservations.length - 1;
					do {
						reservations[currentLastIdx].reservList.push({
							id: result[i].id,
							arrival: result[i].arrival,
							checkout: result[i].checkout,
						});
						i++;
					} while (i < result.length && result[i].guest == result[i - 1].guest);
				}
				res.send(reservations);
			}
		}
	);
});

router.get('/:id', (req, res) => {
	db.query(
		`SELECT r.arrival, r.checkout, r.adult_count, r.child_count, 
    rm.id AS room, (DATEDIFF(r.checkout, r.arrival) * rm.price) AS price,
    CONCAT(g.last_name, " ", g.first_name) AS name, g.phone, CONCAT(g.street, ", ", g.zip_code, " ", g.city) AS address, 
    c.name AS country
    FROM reservation r 
    JOIN guest g ON r.guest_id = g.id
    JOIN country c ON g.country_id = c.id 
    JOIN room rm ON r.room_id = rm.id
    WHERE r.id = ?`,
		[req.params.id],
		(err, result) => {
			if (err) res.status(500).send(err);
			else res.send(result[0]);
		}
	);
});

router.post('/', (req, res) => {
	console.log(req.body);
	for (const param of Object.values(req.body)) {
		if (param === '') return res.status(400).send('Please fill out all fields');
	}

	const adultCount = req.body.adult_count;
	if (adultCount < 1)
		return res.status(400).send('At least 1 of the guests must be an adult');

	const childCount = req.body.child_count;
	if (childCount < 0) return res.status(400).send('Invalid guest amount');

	const capacity = req.body.capacity;
	if (adultCount + childCount > capacity)
		return res
			.status(400)
			.send(`Maximum number of guests for this room is ${capacity}`);

	const { arrival, checkout } = req.body;

	if (new Date(arrival) >= new Date(checkout)) {
		return res.status(400).send("The guests can't leave before he arrives");
	}

	const roomId = req.body.room_id;

	checkTaken(roomId, arrival, checkout, res)
		.then(() => {
			if (req.body.guest_id === null) {
				db.query(
					'INSERT INTO guest VALUES(null, ?, ?, ?, ?, ?, ?, ?)',
					[
						req.body.fname,
						req.body.lname,
						req.body.street,
						req.body.city,
						req.body.zip_code,
						req.body.phone,
						req.body.country,
					],
					(err, result) => {
						if (err) res.status(500).send(err);
						else
							insertReserv(
								arrival,
								checkout,
								adultCount,
								childCount,
								roomId,
								res
							);
					}
				);
			} else {
				insertReserv(
					arrival,
					checkout,
					adultCount,
					childCount,
					roomId,
					res,
					req.body.guest_id
				);
			}
		})
		.catch(() => res.status(403).send('Room is taken in chosen period'));
});

router.put('/:id', (req, res) => {
	const id = req.params.id;
	const { roomId, arrival, checkout } = req.body;

	checkTaken(roomId, arrival, checkout, res, ` AND id != ${mysql.escape(id)}`)
		.then(() => {
			db.query(
				'UPDATE reservation SET arrival = ?, checkout = ? WHERE id = ?',
				[arrival, checkout, id],
				(err, result) => {
					if (err) res.status(500).send(err);
					else res.status(204).send(result);
				}
			);
		})
		.catch(() => res.status(403).send('Room is taken in chosen period'));
});

router.delete('/:id', (req, res) => {
	db.query(
		'DELETE FROM reservation WHERE id = ?',
		[req.params.id],
		(err, result) => {
			if (err) res.status(500).send(err);
			else res.status(204).send(result);
		}
	);
});

export default router;
