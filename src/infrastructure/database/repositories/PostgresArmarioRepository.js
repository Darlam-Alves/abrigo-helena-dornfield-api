// src/infrastructure/database/repositories/PostgresArmarioRepository.js

const ArmarioModel = require('../models/armario');
const Armario = require('../../../core/domain/armario');


class PostgresArmarioRepository {
  /**
   * @param {object} armarioData 
   * @returns {Promise<Armario>} 
   */
  async create(armarioData) {
    try {
      const armarioRecord = await ArmarioModel.create({
        num_armario: armarioData.numero,
        categoria: armarioData.categoria,
      });

      return new Armario(
        armarioRecord.num_armario,
        armarioRecord.categoria
      );
    } catch (error) {

      throw new Error(`Erro ao criar armário no banco de dados: ${error.message}`);
    }
  }


  // async findById(numero) { ... }
  // async findAll() { ... }
  // async update(numero, data) { ... }
  // async delete(numero) { ... }
}

module.exports = PostgresArmarioRepository;

