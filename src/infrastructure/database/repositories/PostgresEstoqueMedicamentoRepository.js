// src/infrastructure/database/repositories/PostgresEstoqueMedicamentoRepository.js

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');
const EstoqueMedicamentoModel = require('../models/estoqueMedicamento');

class PostgresEstoqueMedicamentoRepository {
  /**
   * Registra entrada de medicamento no estoque.
   * Se já existir registro para o mesmo medicamento/armário/validade,
   * atualiza a quantidade.
   * @param {object} entradaData
   * @returns {Promise<object>}
   */
  async registrarEntrada(entradaData) {
    try {
      const {
        medicamento_id,
        armario_id,
        quantidade,
        validade,
        origem,
        casela_id, // pode ser null
        tipo       // <-- CORRIGIDO: agora recebemos tipo
      } = entradaData;

      // busca lote igual (mesma validade, mesmo medicamento e mesmo armário)
      const [loteExistente] = await sequelize.query(
        `SELECT id, quantidade
         FROM estoque_medicamento
         WHERE medicamento_id = :medicamento_id
           AND armario_id = :armario_id
           AND validade = :validade`,
        {
          replacements: { medicamento_id, armario_id, validade },
          type: QueryTypes.SELECT
        }
      );

      if (loteExistente) {
        const novaQuantidade = loteExistente.quantidade + quantidade;

        await sequelize.query(
          `UPDATE estoque_medicamento
           SET quantidade = :quantidade,
               origem = :origem,
               casela_id = :casela_id,
               tipo = :tipo
           WHERE id = :id`,
          {
            replacements: {
              quantidade: novaQuantidade,
              origem,
              casela_id,
              tipo,            // <-- CORRIGIDO: agora está no replacements
              id: loteExistente.id
            },
            type: QueryTypes.UPDATE
          }
        );

        return {
          id: loteExistente.id,
          medicamento_id,
          armario_id,
          quantidade: novaQuantidade,
          validade,
          origem,
          casela_id,
          tipo,
          operacao: "atualizado"
        };
      }

      // novo lote
      const [rows] = await sequelize.query(
        `INSERT INTO estoque_medicamento 
          (medicamento_id, armario_id, quantidade, validade, origem, casela_id, tipo)
         VALUES 
          (:medicamento_id, :armario_id, :quantidade, :validade, :origem, :casela_id, :tipo)
         RETURNING id`,
        {
          replacements: {
            medicamento_id,
            armario_id,
            quantidade,
            validade,
            origem,
            casela_id,
            tipo              // <-- CORRIGIDO
          },
          type: QueryTypes.INSERT
        }
      );

      const insertedId = Array.isArray(rows) && rows[0] ? rows[0].id : rows;

      return {
        id: insertedId,
        medicamento_id,
        armario_id,
        quantidade,
        validade,
        origem,
        casela_id,
        tipo,
        operacao: "criado"
      };

    } catch (error) {
      throw new Error(`Erro ao registrar entrada de medicamento: ${error.message}`);
    }
  }

  /**
   * Busca todos os medicamentos.
   * @returns {Promise<EstoqueMedicamento[]>} 
   */
  async findAll() {
    try {
      return await EstoqueMedicamentoModel.findAll();
    } catch (error) {
      throw new Error(`Erro ao buscar medicamentos no estoque: ${error.message}`);
    }
  }

  /**
   * Registra saída de medicamento (baixa no estoque)
   */
  async registrarSaida(saidaData) {
    try {
      const { estoque_id, armario_id, quantidade } = saidaData;

      const [estoque] = await sequelize.query(
        `SELECT id, quantidade 
         FROM estoque_medicamento
         WHERE id = :estoque_id 
           AND armario_id = :armario_id`,
        {
          replacements: { estoque_id, armario_id },
          type: QueryTypes.SELECT
        }
      );

      if (!estoque) {
        throw new Error('Medicamento não encontrado no estoque deste armário.');
      }

      if (estoque.quantidade < quantidade) {
        throw new Error(
          `Quantidade insuficiente no estoque. Disponível: ${estoque.quantidade}`
        );
      }

      const novaQuantidade = estoque.quantidade - quantidade;

      await sequelize.query(
        `UPDATE estoque_medicamento
         SET quantidade = :quantidade
         WHERE id = :id`,
        {
          replacements: { quantidade: novaQuantidade, id: estoque.id },
          type: QueryTypes.UPDATE
        }
      );

      return {
        id: estoque_id,
        armario_id,
        quantidade_anterior: estoque.quantidade,
        quantidade_retirada: quantidade,
        quantidade_atual: novaQuantidade,
      };

    } catch (error) {

      if (
        error.message.includes('não encontrado') ||
        error.message.includes('insuficiente')
      ) {
        throw error;
      }

      throw new Error(`Erro ao registrar saída de medicamento: ${error.message}`);
    }
  }

  /**
   * Verifica se um medicamento existe.
   */
  async medicamentoExiste(medicamento_id) {
    try {
      const [result] = await sequelize.query(
        `SELECT id FROM medicamento WHERE id = :medicamento_id`,
        {
          replacements: { medicamento_id },
          type: QueryTypes.SELECT
        }
      );

      return !!result;

    } catch (error) {
      throw new Error(`Erro ao verificar medicamento: ${error.message}`);
    }
  }

  /**
   * Verifica se um armário existe.
   */
  async armarioExiste(armario_id) {
    try {
      const [result] = await sequelize.query(
        `SELECT num_armario FROM armario 
         WHERE num_armario = :armario_id`,
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

  /**
   * Verifica se a casela / residente existe.
   */
  async caselaExiste(num_casela) {
    try {
      const [result] = await sequelize.query(
        `SELECT num_casela 
         FROM paciente 
         WHERE num_casela = :num_casela`,
        {
          replacements: { num_casela },
          type: QueryTypes.SELECT
        }
      );

      return !!result;

    } catch (error) {
      throw new Error(`Erro ao verificar residente/casela: ${error.message}`);
    }
  }

  async buscarEstoqueCompleto(estoque_id) {
    const [result] = await sequelize.query(
      `
        SELECT 
          id,
          medicamento_id,
          casela_id,
          armario_id,
          validade,
          quantidade
        FROM estoque_medicamento
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

module.exports = PostgresEstoqueMedicamentoRepository;
