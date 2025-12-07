// src/infrastructure/database/repositories/PostgresInsumoRepository.js

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');
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


  /**
   * Busca todos os insumos.
   * @returns {Promise<Insumo[]>} 
   */
  async findAll() {
    try {
      const insumos = await InsumoModel.findAll();
      return insumos.map(insumo => new Insumo(
        insumo.id,
        insumo.nome,
        insumo.estoque_minimo
      ));
    } catch (error) {
      throw new Error(`Erro ao buscar insumo: ${error.message}`);
    }
  }

  /**
   * Busca um insumo pelo ID.
   * @param {number} id 
   * @returns {Promise<Insumo|null>} 
   */
  async findById(id) {
    try {
      const insumo = await InsumoModel.findByPk(id);
      
      if (!insumo) {
        return null;
      }

      return new Insumo(
        insumo.id,
        insumo.nome,
        insumo.estoque_minimo
      );
    } catch (error) {
      throw new Error(`Erro ao buscar insumo: ${error.message}`);
    }
  }

  /**
   * Atualiza um insumo pelo ID.
   * @param {number} id 
   * @param {object} insumoData 
   * @returns {Promise<Insumo>} 
   */
  async update(id, insumoData) {
    try {
      const insumo = await InsumoModel.findByPk(id);
      
      if (!insumo) {
        return null;
      }

      // Atualiza os campos
      await insumo.update({
        nome: insumoData.nome !== undefined ? insumoData.nome : insumo.nome,
        estoque_minimo: insumoData.estoque_minimo !== undefined ? insumoData.estoque_minimo : insumo.estoque_minimo,
      });

      return new Insumo(
        insumo.id,
        insumo.nome,
        insumo.estoque_minimo
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar insumo: ${error.message}`);
    }
  }

  /**
   * Verifica se um insumo está em estoque ou tem movimentações.
   * @param {number} id 
   * @returns {Promise<boolean>} true se está em uso, false se não está
   */
  async isInUse(id) {
    try {
      // Verifica no estoque de insumos
      const [estoqueCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM estoque_insumo WHERE insumo_id = :insumo_id',
        {
          replacements: { insumo_id: id },
          type: QueryTypes.SELECT
        }
      );

      if (parseInt(estoqueCount.count) > 0) {
        return true;
      }

      // Verifica nas movimentações
      const [movimentacaoCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM movimentacao WHERE insumo_id = :insumo_id',
        {
          replacements: { insumo_id: id },
          type: QueryTypes.SELECT
        }
      );

      if (parseInt(movimentacaoCount.count) > 0) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Erro ao verificar uso do insumo: ${error.message}`);
    }
  }

  /**
   * Deleta um insumo pelo ID.
   * @param {number} id 
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async delete(id) {
    try {
      const deleted = await InsumoModel.destroy({
        where: { id: id }
      });

      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar insumo: ${error.message}`);
    }
  }
}

module.exports = PostgresInsumoRepository;


