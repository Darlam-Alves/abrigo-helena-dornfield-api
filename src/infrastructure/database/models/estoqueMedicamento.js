const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); 
const MedicamentoModel = require('./medicamento');
const ResidenteModel = require('./residente');

const EstoqueMedicamentoModel = sequelize.define('EstoqueMedicamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  medicamento_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  casela_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },  
  armario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },  
  validade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  origem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },  
}, {
  tableName: 'estoque_medicamento', 
  timestamps: false, 
});

EstoqueMedicamentoModel.belongsTo(MedicamentoModel, {
  foreignKey: 'medicamento_id',
  as: 'medicamento'
});

EstoqueMedicamentoModel.belongsTo(ResidenteModel, {
  foreignKey: 'casela_id',
  as: 'residente'
});

module.exports = EstoqueMedicamentoModel;