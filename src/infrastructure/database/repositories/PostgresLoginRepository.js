const { QueryTypes } = require('sequelize');
const sequelize = require('../connection');
const LoginModel = require('../models/login');
const Login = require('../../../core/domain/login');


class PostgresLoginRepository {
  /**
   * @param {object} loginData 
   * @returns {Promise<Login>} 
   */
  async create(loginData) {
    try {
      const loginRecord = await LoginModel.create({
        login: loginData.login,
        password: loginData.password,
      });

      return new Login(
        loginRecord.id,
        loginRecord.login,
        loginRecord.password
      );
    } catch (error) {

      throw new Error(`Erro ao criar login no banco de dados: ${error.message}`);
    }
  }


  /**
   * Busca todos os login.
   * @returns {Promise<Login[]>} 
   */
  async findAll() {
    try {
      const logs = await LoginModel.findAll();
      return logs.map(log => new Login(
        log.id,
        log.login,
        log.password
      ));
    } catch (error) {
      throw new Error(`Erro ao buscar login: ${error.message}`);
    }
  }

  /**
   * Busca um login pelo ID.
   * @param {number} id 
   * @returns {Promise<Login|null>} 
   */
  async findById(id) {
    try {
      const login = await LoginModel.findByPk(id);
      
      if (!login) {
        return null;
      }

      return new Login(
        login.id,
        login.login,
        login.password
      );
    } catch (error) {
      throw new Error(`Erro ao buscar login: ${error.message}`);
    }
  }

  /**
   * Busca um usuário pelo login.
   * @param {string} login
   * @returns {Promise<Login|null>}
   */
  async findByLogin(login) {
    try {
      const loginRecord = await LoginModel.findOne({
        where: { login }
      });
    
      if (!loginRecord) {
        return null;
      }
    
      return new Login(
        loginRecord.id,
        loginRecord.login,
        loginRecord.password
      );
      
    } catch (error) {
      throw new Error(`Erro ao buscar login por login: ${error.message}`);
    }
  }

  /**
   * Atualiza um login pelo ID.
   * @param {number} id 
   * @param {object} loginData 
   * @returns {Promise<Login>} 
   */
  async update(id, loginData) {
    try {
      const login = await LoginModel.findByPk(id);
      
      if (!login) {
        return null;
      }

      // Atualiza os campos
      await login.update({
        login: loginData.login !== undefined ? loginData.login : login.login,
        password: loginData.password !== undefined ? loginData.password : login.password,
      });

      return new Login(
        login.id,
        login.login,
        login.password
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar login: ${error.message}`);
    }
  }
}

module.exports = PostgresLoginRepository;







