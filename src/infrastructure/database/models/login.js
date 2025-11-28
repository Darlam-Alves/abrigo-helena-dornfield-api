const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const LoginModel = sequelize.define('Login', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true    
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'login',
  timestamps: false
});

module.exports = LoginModel;
