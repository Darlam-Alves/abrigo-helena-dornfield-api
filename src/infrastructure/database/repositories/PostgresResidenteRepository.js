

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');
const ResidenteModel = require('../models/residente');
const Residente = require('../../../core/domain/residente');

class PostgresResidenteRepository {
  /**
   * @param {object} residenteData 
   * @returns {Promise<Residente[]>} 
   */
  async findAll() {
    try {
      const residentes = await ResidenteModel.findAll();
      return residentes.map(residente => new Residente(
        residente.num_casela,
        residente.nome
      ));
    } catch (error) {
      throw new Error(`Erro ao buscar residentes: ${error.message}`);
    }
  }

  async findByCasela(num_casela) {
    try {
      console.log("tentando buscar residente... para deletar");
      const residentes = await ResidenteModel.findByPk(num_casela);
      
      if (!residentes) {
        return null;
      }
      console.log("residente encontrado");
      return new Residente(
        residente.num_casela,
        residente.nome
      );
    } catch (error) {
      throw new Error(`Erro ao buscar residente: ${error.message}`);
    }
  }

  async create(residenteData) {
    try {
      const residenteRecord = await ResidenteModel.create({
        num_casela: residenteData.num_casela,
        nome: residenteData.nome,
      });

      return new Residente(
        residenteRecord.num_casela,
        residenteRecord.nome,
      );
    } catch (error) {

      throw new Error(`Erro ao criar residente no banco de dados: ${error.message}`);
    }
  }

  async update(num_casela) {
    try {
      const residente = await ResidenteModel.findByPk(num_casela);
      
      if (!residente) {
        return null;
      }

      // Atualiza os campos
      await residente.update({
        num_casela: residenteData.num_casela !== undefined ? residenteData.num_casela : medicamento.num_casela,
        nome: residenteData.nome !== undefined ? residenteData.nome : medicamento.nome,
      });

      return new Medicamento(
        medicamento.num_casela,
        medicamento.nome        
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar residente: ${error.message}`);
    }
  }

  async delete(num_casela) {
    try {
      const deleted = await ResidenteModel.destroy({
        where: { num_casela: num_casela }
      });

      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar residente: ${error.message}`);
    }
  }
}

module.exports = PostgresResidenteRepository;
