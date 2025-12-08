// src/infrastructure/database/repositories/PostgresEstoqueInsumoRepository.js

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');

class PostgresEstoqueInsumoRepository {
  /**
   * Registra entrada de insumo no estoque.
   * Se já existir registro para o mesmo insumo/armário, atualiza a quantidade.
   * @param {object} entradaData - Dados da entrada (insumo_id, armario_id, quantidade)
   * @returns {Promise<object>} Registro criado/atualizado
   */
  async registrarEntrada(entradaData) {
    try {
      const { insumo_id, armario_id, quantidade } = entradaData;

      // Verifica se já existe registro para este insumo neste armário
      const [existente] = await sequelize.query(
        `SELECT id, quantidade FROM estoque_insumo 
         WHERE insumo_id = :insumo_id AND armario_id = :armario_id`,
        {
          replacements: { insumo_id, armario_id },
          type: QueryTypes.SELECT
        }
      );

      if (existente) {
        // Atualiza a quantidade existente
        const novaQuantidade = existente.quantidade + quantidade;
        await sequelize.query(
          `UPDATE estoque_insumo 
           SET quantidade = :quantidade 
           WHERE id = :id`,
          {
            replacements: { quantidade: novaQuantidade, id: existente.id },
            type: QueryTypes.UPDATE
          }
        );

        return {
          id: existente.id,
          insumo_id,
          armario_id,
          quantidade: novaQuantidade,
          operacao: 'atualizado'
        };
      } else {
        // Cria novo registro
        const [result] = await sequelize.query(
          `INSERT INTO estoque_insumo (insumo_id, armario_id, quantidade) 
           VALUES (:insumo_id, :armario_id, :quantidade) 
           RETURNING id`,
          {
            replacements: { insumo_id, armario_id, quantidade },
            type: QueryTypes.INSERT
          }
        );

        return {
          id: result[0]?.id || result,
          insumo_id,
          armario_id,
          quantidade,
          operacao: 'criado'
        };
      }
    } catch (error) {
      throw new Error(`Erro ao registrar entrada de insumo: ${error.message}`);
    }
  }

  /**
   * Registra saída de insumo do estoque.
   * @param {object} saidaData - Dados da saída (insumo_id, armario_id, quantidade)
   * @returns {Promise<object>} Resultado da operação
   */
  async registrarSaida(saidaData) {
    try {
      const { insumo_id, armario_id, quantidade } = saidaData;

      // Verifica estoque atual
      const [estoque] = await sequelize.query(
        `SELECT id, quantidade FROM estoque_insumo 
         WHERE insumo_id = :insumo_id AND armario_id = :armario_id`,
        {
          replacements: { insumo_id, armario_id },
          type: QueryTypes.SELECT
        }
      );

      if (!estoque) {
        throw new Error('Insumo não encontrado no estoque deste armário.');
      }

      if (estoque.quantidade < quantidade) {
        throw new Error(`Quantidade insuficiente no estoque. Disponível: ${estoque.quantidade}`);
      }

      const novaQuantidade = estoque.quantidade - quantidade;

      // Atualiza a quantidade
      await sequelize.query(
        `UPDATE estoque_insumo 
         SET quantidade = :quantidade 
         WHERE id = :id`,
        {
          replacements: { quantidade: novaQuantidade, id: estoque.id },
          type: QueryTypes.UPDATE
        }
      );

      return {
        id: estoque.id,
        insumo_id,
        armario_id,
        quantidade_anterior: estoque.quantidade,
        quantidade_retirada: quantidade,
        quantidade_atual: novaQuantidade
      };
    } catch (error) {
      if (error.message.includes('não encontrado') || error.message.includes('insuficiente')) {
        throw error;
      }
      throw new Error(`Erro ao registrar saída de insumo: ${error.message}`);
    }
  }

  /**
   * Verifica se um insumo existe.
   * @param {number} insumo_id 
   * @returns {Promise<boolean>}
   */
  async insumoExiste(insumo_id) {
    try {
      const [result] = await sequelize.query(
        'SELECT id FROM insumo WHERE id = :insumo_id',
        {
          replacements: { insumo_id },
          type: QueryTypes.SELECT
        }
      );
      return !!result;
    } catch (error) {
      throw new Error(`Erro ao verificar insumo: ${error.message}`);
    }
  }

  /**
   * Verifica se um armário existe.
   * @param {number} armario_id 
   * @returns {Promise<boolean>}
   */
  async armarioExiste(armario_id) {
    try {
      const [result] = await sequelize.query(
        'SELECT num_armario FROM armario WHERE num_armario = :armario_id',
        {
          replacements: { armario_id },
          type: QueryTypes.SELECT
        }
      );
      return !!result;
    } catch (error) {
      throw new Error(`Erro ao verificar armário: ${error.message}`);
    }
  }

  async buscarEstoqueCompleto(estoque_id) {
    const [result] = await sequelize.query(
      `
        SELECT 
          id,
          insumo_id,
          casela_id,
          armario_id,
          validade,
          quantidade
        FROM estoque_insumo
        WHERE id = :estoque_id
        LIMIT 1
      `,
      {
        replacements: { estoque_id },
        type: sequelize.QueryTypes.SELECT
      }
    );  
  
    return result;
  }  
}

module.exports = PostgresEstoqueInsumoRepository;

