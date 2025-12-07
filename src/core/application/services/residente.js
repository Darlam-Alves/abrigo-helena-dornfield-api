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
    if (!residenteData.num_casela || !residenteData.nome) {
      throw new Error('Nome e casela são campos obrigatórios.');
    }
    
    if (residenteData.num_casela <= 0) {
      throw new Error('A casela deve ser um valor positivo.');
    }

    // se a casela pertence a outro residente existente
    const existente = await this.residenteRepository.findByCasela(residenteData.num_casela);
    if (existente) {
      throw new Error('Já existe um residente com essa casela.');
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

   async atualizar(residenteData) {
    try {
      if(!residenteData.num_casela) {
        throw new Error('Número da casela é obrigatório.')
      }
      
      // Verificar se o residente existe
      const existente = await this.residenteRepository.findByCasela(residenteData.num_casela);
      if (!existente) {
        throw new Error('Residente não encontrado');
      }
     
      return await this.residenteRepository.update(residenteData);
    } catch (error) {
      throw error;
    }
  }

  async deletar(num_casela) {
    try {
      if (!num_casela || typeof num_casela !== 'number' || num_casela <= 0) {
        throw new Error('Número da casela inválido.')
      }

      await this.buscarPorCasela(num_casela);
      return await this.residenteRepository.delete(num_casela);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ResidenteService;