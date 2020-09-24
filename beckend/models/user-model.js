const { DataTypes } = require('sequelize');
const { sequelize } = require('../data-base/db-connect.js');

const User = sequelize.define("Users", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  token: {
    type: DataTypes.STRING
  }
})

module.exports = User;