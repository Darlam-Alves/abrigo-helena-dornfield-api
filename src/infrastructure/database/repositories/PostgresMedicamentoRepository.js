// src/infrastructure/database/repositories/PostgresMedicamentoRepository.js

const MedicamentoModel = require('../models/medicamento');
const Medicamento = require('../../../core/domain/medicamento');


class PostgresMedicamentoRepository {
  /**
   * @param {object} medicamentoData 
   * @returns {Promise<Medicamento>} 
   */
  async create(medicamentoData) {
    try {
      const medicamentoRecord = await MedicamentoModel.create({
        nome: medicamentoData.nome,
        dosagem: medicamentoData.dosagem,
        unidade_medida: medicamentoData.unidade_medida,
        substancia: medicamentoData.substancia || null,
      });

      return new Medicamento(
        medicamentoRecord.id,
        medicamentoRecord.nome,
        medicamentoRecord.dosagem,
        medicamentoRecord.unidade_medida,
        medicamentoRecord.substancia
      );
    } catch (error) {

      throw new Error(`Erro ao criar medicamento no banco de dados: ${error.message}`);
    }
  }


  // async findById(id) { ... }
  // async findAll() { ... }
  // async update(id, data) { ... }
  // async delete(id) { ... }
}

module.exports = PostgresMedicamentoRepository;


