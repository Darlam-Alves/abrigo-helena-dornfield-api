const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Armario = sequelize.define('Armario', {
  num_armario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'num_armario'
  },
  categoria: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'categoria'
  }
}, {
  tableName: 'armario',
  timestamps: false
});

module.exports = Armario;

