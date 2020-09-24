const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_project_1', 'alexandr', '_Kaladyn792', {
  dialect: 'mysql',
  host: 'localhost',
})

async function connect () {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection with database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { 
  sequelize,
  connect,
};