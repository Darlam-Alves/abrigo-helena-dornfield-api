// src/infrastructure/database/repositories/PostgresInsumoRepository.js

const InsumoModel = require('../models/insumo');
const Insumo = require('../../../core/domain/insumo');


class PostgresInsumoRepository {
  /**
   * @param {object} insumoData 
   * @returns {Promise<Insumo>} 
   */
  async create(insumoData) {
    try {
      const insumoRecord = await InsumoModel.create({
        nome: insumoData.nome,
        estoque_minimo: insumoData.estoque_minimo,
      });

      return new Insumo(
        insumoRecord.id,
        insumoRecord.nome,
        insumoRecord.estoque_minimo
      );
    } catch (error) {

      throw new Error(`Erro ao criar insumo no banco de dados: ${error.message}`);
    }
  }


  // async findById(id) { ... }
  // async findAll() { ... }
  // async update(id, data) { ... }
  // async delete(id) { ... }
}

module.exports = PostgresInsumoRepository;


