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
  
    // async listarTodos() { ... }
    // async buscarPorId(id) { ... }
  }
  
  module.exports = InsumoService;