// 

//------------
const { Sequelize } = require('sequelize');
const fs = require('fs');
const bcrypt = require('bcrypt');
const csv = require('csv-parser');
const models = {}; //require('./models'); // Import your Sequelize models here
const { spawnSync } = require('child_process');

module.exports = async function () {
  if (process.env.NODE_ENV !== 'test') {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  });

  try {
    // Attempt to authenticate with the database to ensure it exists
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);

    // Create the database if it doesn't exist
    const createDbCommand = `npx sequelize-cli db:create`;
    console.log(`Creating database...`);

    const createDbProcess = spawnSync(createDbCommand, { stdio: 'inherit', shell: true });

    if (createDbProcess.error) {
      console.error('Error creating database:', createDbProcess.error);
      process.exit(1);
    }

    // execSync(createDbCommand, { stdio: 'inherit' });

    // Attempt to authenticate again after creating the database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  }

  models.User = require('./models/user')(sequelize);
  models.Assignment = require('./models/assignment')(sequelize);

  sequelize.sync();

  const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  fs.createReadStream('/opt/user.csv')
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

  return {
    sequelize,
    models,
    // closeConnection: async () => {
    //   await sequelize.close();
    // },
  };
}
};

