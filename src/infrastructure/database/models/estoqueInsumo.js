const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const InsumoModel = require('./insumo');

const EstoqueInsumoModel = sequelize.define('EstoqueInsumo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  insumo_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }, 
  armario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },  
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }, 
}, {
  tableName: 'estoque_insumo', 
  timestamps: false, 
});

EstoqueInsumoModel.belongsTo(InsumoModel, {
  foreignKey: 'insumo_id',
  as: 'insumo'
});

module.exports = EstoqueInsumoModel;