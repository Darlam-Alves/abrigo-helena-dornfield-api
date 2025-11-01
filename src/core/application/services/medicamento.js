class MedicamentoService {
    constructor(medicamentoRepository) {
      this.medicamentoRepository = medicamentoRepository;
    }
  
    /**
     * Cadastra um novo medicamento após validar os dados.
     * @param {object} medicamentoData - Dados do medicamento vindos do controller.
     * @returns {Promise<object>} O novo medicamento criado.
     */
    async cadastrarNovo(medicamentoData) {
      // 1. APLICAÇÃO DA LÓGICA DE NEGÓCIO (VALIDAÇÃO)
      if (!medicamentoData.nome || medicamentoData.dosagem === undefined || medicamentoData.dosagem === null || !medicamentoData.unidade_medida) {
        throw new Error('Nome, dosagem e unidade de medida são campos obrigatórios.');
      }
      
      if (medicamentoData.dosagem <= 0) {
        throw new Error('A dosagem deve ser um valor positivo.');
      }
  
      // 2. ORQUESTRAÇÃO DA AÇÃO
      const novoMedicamento = await this.medicamentoRepository.create(medicamentoData);
  
      // 3. RETORNO
      return novoMedicamento;
    }
  
    // async listarTodos() { ... }
    // async buscarPorId(id) { ... }
  }
  
  module.exports = MedicamentoService;