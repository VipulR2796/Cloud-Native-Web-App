

const mysql = require('mysql2/promise');

async function getUserFromDatabase(email) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows, fields] = await connection.execute(
      'SELECT * FROM Users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user from database:', error);
    throw error;
  } finally {
    connection.end();
  }
}

module.exports = { getUserFromDatabase };
