// src/infrastructure/database/repositories/PostgresMedicamentoRepository.js

const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');
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
        principio_ativo: medicamentoData.principio_ativo || null,
        estoque_minimo: medicamentoData.estoque_minimo,
      });

      return new Medicamento(
        medicamentoRecord.id,
        medicamentoRecord.nome,
        medicamentoRecord.dosagem,
        medicamentoRecord.unidade_medida,
        medicamentoRecord.principio_ativo,
        medicamentoRecord.estoque_minimo
      );
    } catch (error) {

      throw new Error(`Erro ao criar medicamento no banco de dados: ${error.message}`);
    }
  }

  /**
   * Busca todos os medicamentos.
   * @returns {Promise<Medicamento[]>} 
   */
  async findAll() {
    try {
      const medicamentos = await MedicamentoModel.findAll();
      return medicamentos.map(med => new Medicamento(
        med.id,
        med.nome,
        med.dosagem,
        med.unidade_medida,
        med.principio_ativo,
        med.estoque_minimo
      ));
    } catch (error) {
      throw new Error(`Erro ao buscar medicamentos: ${error.message}`);
    }
  }

  /**
   * Busca um medicamento pelo ID.
   * @param {number} id 
   * @returns {Promise<Medicamento|null>} 
   */
  async findById(id) {
    try {
      const medicamento = await MedicamentoModel.findByPk(id);
      
      if (!medicamento) {
        return null;
      }

      return new Medicamento(
        medicamento.id,
        medicamento.nome,
        medicamento.dosagem,
        medicamento.unidade_medida,
        medicamento.principio_ativo,
        medicamento.estoque_minimo
      );
    } catch (error) {
      throw new Error(`Erro ao buscar medicamento: ${error.message}`);
    }
  }

  /**
   * Atualiza um medicamento pelo ID.
   * @param {number} id 
   * @param {object} medicamentoData 
   * @returns {Promise<Medicamento>} 
   */
  async update(id, medicamentoData) {
    try {
      const medicamento = await MedicamentoModel.findByPk(id);
      
      if (!medicamento) {
        return null;
      }

      // Atualiza os campos
      await medicamento.update({
        nome: medicamentoData.nome !== undefined ? medicamentoData.nome : medicamento.nome,
        dosagem: medicamentoData.dosagem !== undefined ? medicamentoData.dosagem : medicamento.dosagem,
        unidade_medida: medicamentoData.unidade_medida !== undefined ? medicamentoData.unidade_medida : medicamento.unidade_medida,
        principio_ativo: medicamentoData.principio_ativo !== undefined ? medicamentoData.principio_ativo : medicamento.principio_ativo,
        estoque_minimo: medicamentoData.estoque_minimo !== undefined ? medicamentoData.estoque_minimo : medicamento.estoque_minimo,
      });

      return new Medicamento(
        medicamento.id,
        medicamento.nome,
        medicamento.dosagem,
        medicamento.unidade_medida,
        medicamento.principio_ativo,
        medicamento.estoque_minimo
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar medicamento: ${error.message}`);
    }
  }

  /**
   * Verifica se um medicamento está em estoque ou tem movimentações.
   * @param {number} id 
   * @returns {Promise<boolean>} true se está em uso, false se não está
   */
  async isInUse(id) {
    try {
      // Verifica no estoque de medicamentos
      const [estoqueCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM estoque_medicamento WHERE medicamento_id = :medicamento_id',
        {
          replacements: { medicamento_id: id },
          type: QueryTypes.SELECT
        }
      );

      if (parseInt(estoqueCount.count) > 0) {
        return true;
      }

      // Verifica nas movimentações
      const [movimentacaoCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM movimentacao WHERE medicamento_id = :medicamento_id',
        {
          replacements: { medicamento_id: id },
          type: QueryTypes.SELECT
        }
      );

      if (parseInt(movimentacaoCount.count) > 0) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Erro ao verificar uso do medicamento: ${error.message}`);
    }
  }

  /**
   * Deleta um medicamento pelo ID.
   * @param {number} id 
   * @returns {Promise<boolean>} true se deletado com sucesso
   */
  async delete(id) {
    try {
      const deleted = await MedicamentoModel.destroy({
        where: { id: id }
      });

      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar medicamento: ${error.message}`);
    }
  }
}

module.exports = PostgresMedicamentoRepository;


