// src/infrastructure/database/repositories/PostgresMovimentacaoRepository.js

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');

class PostgresMovimentacaoRepository {
  
  /**
   * Insere movimentação no log de movimentações
   */
  async registrar(movimentacaoData) {
    try {
      const {
        tipo,
        login_id,
        medicamento_id,
        insumo_id,
        armario_id,
        casela_id,
        validade_medicamento,
        quantidade
      } = movimentacaoData;

      const [rows] = await sequelize.query(
        `INSERT INTO movimentacao (
            tipo,
            data,
            login_id,
            insumo_id,
            medicamento_id,
            armario_id,
            casela_id,
            validade_medicamento,
            quantidade
        )
        VALUES (
            :tipo,
            NOW(),
            :login_id,
            :insumo_id,
            :medicamento_id,
            :armario_id,
            :casela_id,
            :validade_medicamento,
            :quantidade
        )
        RETURNING id`,
        {
          replacements: {
            tipo,
            login_id,
            insumo_id,
            medicamento_id,
            armario_id,
            casela_id,
            validade_medicamento,
            quantidade
          },
          type: QueryTypes.INSERT
        }
      );

      return {
        id: rows[0]?.id || rows,
        mensagem: 'Movimentação registrada com sucesso'
      };

    } catch (error) {
      throw new Error(`Erro ao registrar movimentação: ${error.message}`);
    }
  }

  async findByMedicamentos() {
    try {
      return await sequelize.query(
        `SELECT * 
           FROM movimentacao 
          WHERE medicamento_id IS NOT NULL
          ORDER BY id DESC`,
        { type: QueryTypes.SELECT }
      );
    } catch (error) {
      throw new Error(`Erro ao buscar movimentações de medicamentos: ${error.message}`);
    }
  }
  
  async findByInsumos() {
    try {
      return await sequelize.query(
        `SELECT * 
           FROM movimentacao 
          WHERE insumo_id IS NOT NULL
          ORDER BY id DESC`,
        { type: QueryTypes.SELECT }
      );
    } catch (error) {
      throw new Error(`Erro ao buscar movimentações de insumos: ${error.message}`);
    }
  }
  


  /**
   * Lista todas movimentações
   */
  async findAll() {
    try {
      return await sequelize.query(
        `SELECT * FROM movimentacao ORDER BY id DESC`,
        { type: QueryTypes.SELECT }
      );
    } catch (error) {
      throw new Error(`Erro ao buscar movimentações: ${error.message}`);
    }
  }
}

module.exports = PostgresMovimentacaoRepository;
