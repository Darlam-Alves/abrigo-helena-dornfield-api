class InsumoService {
    constructor(insumoRepository) {
      this.insumoRepository = insumoRepository;
    }
  
    /**
     * Cadastra um novo insumo após validar os dados.
     * @param {object} insumoData - Dados do insumo vindos do controller.
     * @returns {Promise<object>} O novo insumo criado.
     */
    async cadastrarNovo(insumoData) {
      // 1. APLICAÇÃO DA LÓGICA DE NEGÓCIO (VALIDAÇÃO)
      if (!insumoData.nome) {
        throw new Error('Nome é um campo obrigatório.');
      }
  
      // 2. ORQUESTRAÇÃO DA AÇÃO
      const novoInsumo = await this.insumoRepository.create(insumoData);
  
      // 3. RETORNO
      return novoInsumo;
    }

  /**
   * Lista todos os insumos.
   * @returns {Promise<Array>} Lista de insumos.
   */
  async listarTodos() {
    const insumos = await this.insumoRepository.findAll();
    return insumos;
  }

    /**
     * Busca um insumo pelo ID.
     * @param {number} id - ID do insumo.
     * @returns {Promise<object>} O insumo encontrado.
     */
    async buscarPorId(id) {
      // VALIDAÇÃO
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('ID do insumo inválido.');
      }

      // BUSCA NO REPOSITÓRIO
      const insumo = await this.insumoRepository.findById(id);
      
      if (!insumo) {
        throw new Error('Insumo não encontrado.');
      }

      return insumo;
    } 
    
    /**
     * Atualiza um insumo após validações.
     * @param {number} id - ID do insumo a atualizar.
     * @param {object} insumoData - Dados para atualização.
     * @returns {Promise<object>} O insumo atualizado.
     */
    async atualizar(id, insumoData) {
      // 1. VALIDAÇÃO DO ID
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('ID do insumo inválido.');
      }

      if (insumoData.estoque_minimo !== undefined && insumoData.estoque_minimo < 0) {
        throw new Error('O estoque mínimo não pode ser negativo.');
      }

      // 3. ATUALIZA NO REPOSITÓRIO
      const insumoAtualizado = await this.insumoRepository.update(id, insumoData);
      
      if (!insumoAtualizado) {
        throw new Error('Insumo não encontrado.');
      }

      return insumoAtualizado;
    }

    /**
     * Deleta um insumo após validações.
     * @param {number} id - ID do insumo a deletar.
     * @returns {Promise<boolean>} true se deletado com sucesso.
     */
    async deletar(id) {
      // 1. VALIDAÇÃO DO ID
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('ID do insumo inválido.');
      }

      // 2. VERIFICA SE O INSUMO EXISTE
      const insumo = await this.insumoRepository.findById(id);
      if (!insumo) {
        throw new Error('Insumo não encontrado.');
      }

      // 3. VERIFICA SE O INSUMO ESTÁ EM USO
      const isInUse = await this.insumoRepository.isInUse(id);
      if (isInUse) {
        throw new Error('Não é possível deletar o insumo pois ele está em estoque ou possui movimentações registradas.');
      }

      // 4. DELETA O INSUMO
      const deleted = await this.insumoRepository.delete(id);
      
      if (!deleted) {
        throw new Error('Erro ao deletar insumo.');
      }

      return true;
    }    
  }
  
  module.exports = InsumoService;