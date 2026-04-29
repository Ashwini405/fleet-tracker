const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDB() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to Aiven MySQL database successfully.');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        module VARCHAR(100) NOT NULL,
        deadline DATE NOT NULL,
        status ENUM('Pending', 'In Progress', 'Done') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createTableQuery);
    console.log('Tasks table checked/created.');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

initDB();

module.exports = pool;
