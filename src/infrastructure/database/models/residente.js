const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const ResidenteModel = sequelize.define('Residente', {
  num_casela: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'paciente', 
  timestamps: false, 
});

module.exports = ResidenteModel;