class MovimentacaoService {
    constructor(movimentacaoRepository) {
      this.movimentacaoRepository = movimentacaoRepository;
    }

    async registrar(data) {
        return await this.movimentacaoRepository.registrar(data);
      }
    
      async listar() {
        return await this.movimentacaoRepository.listarTodos();
      }    
  
      async listarMedicamentos() {
        return await this.movimentacaoRepository.findByMedicamentos();
      }
      
      async listarInsumos() {
        return await this.movimentacaoRepository.findByInsumos();
      }
      
    /**
     * Cadastra um novo medicamento após validar os dados.
     * @param {object} movimentacaoData - Dados do medicamento vindos do controller.
     * @returns {Promise<object>} O novo medicamento criado.
     */
    async cadastrarNovo(movimentacaoData) {
      // 1. APLICAÇÃO DA LÓGICA DE NEGÓCIO (VALIDAÇÃO)
      if (!movimentacaoData.nome || movimentacaoData.dosagem === undefined || movimentacaoData.dosagem === null || !movimentacaoData.unidade_medida) {
        throw new Error('Nome, dosagem e unidade de medida são campos obrigatórios.');
      }
      
      if (movimentacaoData.dosagem <= 0) {
        throw new Error('A dosagem deve ser um valor positivo.');
      }
  
      // 2. ORQUESTRAÇÃO DA AÇÃO
      const novaMovimentacao = await this.movimentacaoRepository.create(movimentacaoData);
  
      // 3. RETORNO
      return novaMovimentacao;
    }
  
    /**
     * Lista todos as as movimentações.
     * @returns {Promise<Array>} Lista de movimentações.
     */
    async listarTodos() {
      const movimentacoes = await this.movimentacaoRepository.findAll();
      return movimentacoes;
    }
  }
  
  module.exports = MovimentacaoService;