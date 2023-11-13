const mysql = require('mysql2');
const dotenv = require('dotenv');
const Bluebird = require('bluebird');


dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

db.query = Bluebird.promisify(db.query);

module.exports = db;