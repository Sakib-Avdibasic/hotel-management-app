import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'hotel',
	dateStrings: true,
});

db.connect(err => {
	if (err) {
		console.error('connection failed' + err.stack);
		return;
	}
	console.log('connected as' + db.threadId);
});

export default db;
