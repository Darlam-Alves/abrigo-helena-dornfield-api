const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); 

const MedicamentoModel = sequelize.define('Medicamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosagem: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  unidade_medida: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  principio_ativo: {
    type: DataTypes.STRING,
  },
  estoque_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'medicamento', // Nome exato da tabela no banco
  timestamps: false, 
});

module.exports = MedicamentoModel;