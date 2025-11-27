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
  
    /**
     * Lista todos os medicamentos.
     * @returns {Promise<Array>} Lista de medicamentos.
     */
    async listarTodos() {
      const medicamentos = await this.medicamentoRepository.findAll();
      return medicamentos;
    }

    /**
     * Busca um medicamento pelo ID.
     * @param {number} id - ID do medicamento.
     * @returns {Promise<object>} O medicamento encontrado.
     */
    async buscarPorId(id) {
      // VALIDAÇÃO
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('ID do medicamento inválido.');
      }

      // BUSCA NO REPOSITÓRIO
      const medicamento = await this.medicamentoRepository.findById(id);
      
      if (!medicamento) {
        throw new Error('Medicamento não encontrado.');
      }

      return medicamento;
    }

    /**
     * Atualiza um medicamento após validações.
     * @param {number} id - ID do medicamento a atualizar.
     * @param {object} medicamentoData - Dados para atualização.
     * @returns {Promise<object>} O medicamento atualizado.
     */
    async atualizar(id, medicamentoData) {
      // 1. VALIDAÇÃO DO ID
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('ID do medicamento inválido.');
      }

      // 2. VALIDAÇÃO DOS DADOS
      if (medicamentoData.dosagem !== undefined && medicamentoData.dosagem <= 0) {
        throw new Error('A dosagem deve ser um valor positivo.');
      }

      if (medicamentoData.estoque_minimo !== undefined && medicamentoData.estoque_minimo < 0) {
        throw new Error('O estoque mínimo não pode ser negativo.');
      }

      // 3. ATUALIZA NO REPOSITÓRIO
      const medicamentoAtualizado = await this.medicamentoRepository.update(id, medicamentoData);
      
      if (!medicamentoAtualizado) {
        throw new Error('Medicamento não encontrado.');
      }

      return medicamentoAtualizado;
    }

    /**
     * Deleta um medicamento após validações.
     * @param {number} id - ID do medicamento a deletar.
     * @returns {Promise<boolean>} true se deletado com sucesso.
     */
    async deletar(id) {
      // 1. VALIDAÇÃO DO ID
      if (!id || typeof id !== 'number' || id <= 0) {
        throw new Error('ID do medicamento inválido.');
      }

      // 2. VERIFICA SE O MEDICAMENTO EXISTE
      const medicamento = await this.medicamentoRepository.findById(id);
      if (!medicamento) {
        throw new Error('Medicamento não encontrado.');
      }

      // 3. VERIFICA SE O MEDICAMENTO ESTÁ EM USO
      const isInUse = await this.medicamentoRepository.isInUse(id);
      if (isInUse) {
        throw new Error('Não é possível deletar o medicamento pois ele está em estoque ou possui movimentações registradas.');
      }

      // 4. DELETA O MEDICAMENTO
      const deleted = await this.medicamentoRepository.delete(id);
      
      if (!deleted) {
        throw new Error('Erro ao deletar medicamento.');
      }

      return true;
    }
  }
  
  module.exports = MedicamentoService;