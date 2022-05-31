import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import db from '../db.js';

const router = express.Router();

router.get('/:id', (req, res) => {
	db.query(
		`SELECT r.id, r.bed_single, r.bed_double, r.bar, r.smoking, bt.type AS bathroom_type, r.price
    FROM room r 
    JOIN bathroom_type bt ON r.bathroomtype_id = bt.id 
    WHERE r.id = ?`,
		req.params.id,
		(err, result) => {
			if (err) res.status(500).send(err);
			else {
				const room = result[0];
				// cast MySQL tinyint to JS bool
				room.bar = !!room.bar;
				room.smoking = !!room.smoking;
				res.send(room);
			}
		}
	);
});

export default router;
