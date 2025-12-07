
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
      const residente = await ResidenteModel.findByPk(num_casela);
      
      if (!residente) {
        return null;
      }

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

  async update(residenteData) {
    try {
      const residente = await ResidenteModel.findByPk(residenteData.num_casela);
      
      if (!residente) {
        throw new Error('Residente não encontrado');
      }

      // Atualiza os campos
      await residente.update({
        nome: residenteData.nome
      });

      return new Residente(
        residente.num_casela,
        residente.nome        
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
