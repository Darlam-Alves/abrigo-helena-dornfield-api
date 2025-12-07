class ResidenteService {
  constructor(residenteRepository) {
    this.residenteRepository = residenteRepository;
  }

  /**
   * Cadastra um novo residente após validar os dados.
   * @param {object} residenteData - Dados do residente vindos do controller.
   * @returns {Promise<object>} O novo residente criado.
   */

  async cadastrarNovo(residenteData) {
    if (!residenteData.num_casela || residenteData.nome === null) {
      throw new Error('Nome e casela são campos obrigatórios.');
    }
    
    if (residenteData.num_casela <= 0) {
      throw new Error('A casela deve ser um valor positivo.');
    }

    const novoResidente = await this.residenteRepository.create(residenteData);
    return novoResidente;
  }

  /**
   * Lista todos os residentes.
   * @returns {Promise<Array>} Lista de residentes.
   */
  async listarTodos() {
    const residentes = await this.residenteRepository.findAll();
    return residentes;
  }

  async buscarPorCasela(num_casela) {
    if (!num_casela || typeof num_casela !== 'number' || num_casela <= 0) {
      throw new Error('Número da casela inválido.');
    }

    const residente = await this.residenteRepository.findByCasela(num_casela);
  
    if (!residente) {
      throw new Error('Residente não encontrado.');
    }
    return residente;
  }

  async update(residenteData) {
    try {
      const residente = new Residente(residenteData.casela, residenteData.name);
      residente.validate();
     
      // Verificar se o residente existe
      await this.findByCasela(residente.numCasela);
     
      return await this.residenteRepository.update(residente);
    } catch (error) {
      throw error;
    }
  }

  async delete(casela) {
    try {
      // Verificar se o residente existe
      await this.buscarPorCasela(casela);
      return await this.residenteRepository.delete(casela);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ResidenteService;