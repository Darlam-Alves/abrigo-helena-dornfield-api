const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); 

const MovimentacaoModel = sequelize.define('Movimentacao', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.TIMESTAMP,
    allowNull: false,
  },
  login_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  insumo_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  medicamento_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  armario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  casela_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  validade_medicamento: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },        
}, {
  tableName: 'movimentacao', 
  timestamps: false, 
});

module.exports = MovimentacaoModel;