// src/infrastructure/database/repositories/PostgresArmarioRepository.js

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');
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

  /**
   * Busca todos os armários.
   * @returns {Promise<Armario[]>} 
   */
  async findAll() {
    try {
      const armarios = await ArmarioModel.findAll();
      return armarios.map(armario => new Armario(
        armario.num_armario,
        armario.categoria
      ));
    } catch (error) {
      throw new Error(`Erro ao buscar armários: ${error.message}`);
    }
  }

  /**
   * Busca um armário pelo número.
   * @param {number} numero 
   * @returns {Promise<Armario|null>} 
   */
  async findById(numero) {
    try {
      const armario = await ArmarioModel.findByPk(numero);
      
      if (!armario) {
        return null;
      }

      return new Armario(
        armario.num_armario,
        armario.categoria
      );
    } catch (error) {
      throw new Error(`Erro ao buscar armário: ${error.message}`);
    }
  }

  /**
   * Verifica se um armário contém itens (insumos ou medicamentos).
   * @param {number} numero 
   * @returns {Promise<boolean>} true se contém itens, false se vazio
   */
  async hasItems(numero) {
    try {
      // Verifica insumos no armário
      const [insumosCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM estoque_insumo WHERE armario_id = :armario_id',
        {
          replacements: { armario_id: numero },
          type: QueryTypes.SELECT
        }
      );

      if (parseInt(insumosCount.count) > 0) {
        return true;
      }

      // Verifica medicamentos no armário
      const [medicamentosCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM estoque_medicamento WHERE armario_id = :armario_id',
        {
          replacements: { armario_id: numero },
          type: QueryTypes.SELECT
        }
      );

      if (parseInt(medicamentosCount.count) > 0) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Erro ao verificar itens do armário: ${error.message}`);
    }
  }

  /**
   * Deleta um armário pelo número.
   * @param {number} numero 
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async delete(numero) {
    try {
      const deleted = await ArmarioModel.destroy({
        where: { num_armario: numero }
      });

      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar armário: ${error.message}`);
    }
  }

  // async update(numero, data) { ... }
}

module.exports = PostgresArmarioRepository;

