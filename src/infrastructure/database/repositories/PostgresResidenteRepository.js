const sequelize = require('../connection');
const { QueryTypes } = require('sequelize');

class PostgresResidenteRepository {
  async findAll() {
    try {
      const residentes = await sequelize.query(
        'SELECT num_casela, nome FROM paciente ORDER BY num_casela',
        { type: QueryTypes.SELECT }
      );

      return residentes.map(row => ({
        casela: row.num_casela,
        name: row.nome
      }));
    } catch (error) {
      console.error('Erro ao buscar residentes:', error);
      throw new Error('Erro ao buscar residentes');
    }
  }

  async findByCasela(casela) {
    try {
      const [residente] = await sequelize.query(
        'SELECT num_casela, nome FROM paciente WHERE num_casela = :casela',
        {
          replacements: { casela },
          type: QueryTypes.SELECT
        }
      );

      if (!residente) return null;

      return {
        casela: residente.num_casela,
        name: residente.nome
      };
    } catch (error) {
      console.error(`Erro ao buscar residente pela casela ${casela}:`, error);
      throw new Error('Erro ao buscar residente');
    }
  }

  async create(residente) {
    try {
      const [result] = await sequelize.query(
        'INSERT INTO paciente (num_casela, nome) VALUES (:numCasela, :nome) RETURNING num_casela, nome',
        {
          replacements: {
            numCasela: residente.numCasela,
            nome: residente.nome
          },
          type: QueryTypes.INSERT
        }
      );

      return {
        casela: result.num_casela,
        name: result.nome
      };
    } catch (error) {
      console.error('Erro ao criar residente:', error);
      throw new Error('Erro ao criar residente');
    }
  }

  async update(residente) {
    try {
      const [result] = await sequelize.query(
        'UPDATE paciente SET nome = :nome WHERE num_casela = :numCasela RETURNING num_casela, nome',
        {
          replacements: {
            nome: residente.nome,
            numCasela: residente.numCasela
          },
          type: QueryTypes.UPDATE
        }
      );

      if (!result || result.length === 0) {
        throw new Error('Residente não encontrado');
      }

      return {
        casela: result[0].num_casela,
        name: result[0].nome
      };
    } catch (error) {
      console.error('Erro ao atualizar residente:', error);
      throw new Error('Erro ao atualizar residente');
    }
  }

  async delete(casela) {
    try {
      const [result] = await sequelize.query(
        'DELETE FROM paciente WHERE num_casela = :casela RETURNING num_casela, nome',
        {
          replacements: { casela },
          type: QueryTypes.DELETE
        }
      );

      if (!result || result.length === 0) {
        throw new Error('Residente não encontrado');
      }

      return true; // delete OK
    } catch (error) {
      console.error('Erro ao excluir residente:', error);
      throw new Error('Erro ao excluir residente');
    }
  }
}

module.exports = PostgresResidenteRepository;
