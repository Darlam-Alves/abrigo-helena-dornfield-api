const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); 

const InsumoModel = sequelize.define('Insumo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estoque_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'insumo', 
  timestamps: false, 
});

module.exports = InsumoModel;