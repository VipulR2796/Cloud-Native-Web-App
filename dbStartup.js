// dbStartup.js

const { Sequelize } = require('sequelize');
const fs = require('fs');
const bcrypt = require('bcrypt');
const csv = require('csv-parser');

// Initialize the database connection here
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
});

async function initializeDatabase() {
  try {
    // Attempt to authenticate with the database to ensure it exists
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Handle the error here if needed
  }
}

initializeDatabase();

const models = {}; // Import your Sequelize models here

models.User = require('./models/user')(sequelize);
models.Assignment = require('./models/assignment')(sequelize);
models.Submission = require('./models/submission')(sequelize);

sequelize.sync();

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

///opt/csye6225/users.csv
fs.createReadStream(process.env.USERS_CSV_PATH)
  .pipe(csv())
  .on('data', async (row) => {
    const hashedPassword = await hashPassword(row.password);

    models.User.create({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      password: hashedPassword,
    })
      .then(user => {
        console.log('User inserted:', user.id);
      })
      .catch(error => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.error('User with email already exists:', row.email);
        } else {
          console.error('Error inserting user:', error);
        }
      });
  })
  .on('end', () => {
    console.log('Users inserted from CSV');
  });

module.exports = {
  sequelize, // Export the database connection object
  models,
};
