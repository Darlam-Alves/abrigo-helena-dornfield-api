class EstoqueInsumoService {
  constructor(estoqueInsumoRepository, movimentacaoService) {
    this.estoqueInsumoRepository = estoqueInsumoRepository;
    this.movimentacaoService = movimentacaoService;
  }

  async listarTodos() {
    const estoqueInsumos = await this.estoqueInsumoRepository.findAll();
    return estoqueInsumos;
  }

  /**
   * Registra entrada de insumo no estoque.
   * @param {object} entradaData - Dados da entrada
   * @returns {Promise<object>} Resultado da operação
   */
  async registrarEntrada(entradaData) {
    // 1. VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
    const { insumo_id, armario_id, quantidade } = entradaData;

    if (!insumo_id) {
      throw new Error('O campo insumo_id é obrigatório.');
    }

    if (!armario_id) {
      throw new Error('O campo armario_id é obrigatório.');
    }

    if (quantidade === undefined || quantidade === null) {
      throw new Error('O campo quantidade é obrigatório.');
    }

    // 2. VALIDAÇÃO DOS TIPOS E VALORES
    const validInsumoId = Number(insumo_id);
    const validArmarioId = Number(armario_id);
    const validQuantidade = Number(quantidade);

    if (isNaN(validInsumoId) || validInsumoId <= 0) {
      throw new Error('O insumo_id deve ser um número positivo.');
    }

    if (isNaN(validArmarioId) || validArmarioId <= 0) {
      throw new Error('O armario_id deve ser um número positivo.');
    }

    if (isNaN(validQuantidade) || validQuantidade <= 0) {
      throw new Error('A quantidade deve ser um número positivo.');
    }

    // 3. VERIFICA SE O INSUMO EXISTE
    const insumoExiste = await this.estoqueInsumoRepository.insumoExiste(validInsumoId);
    if (!insumoExiste) {
      throw new Error('Insumo não encontrado.');
    }

    // 4. VERIFICA SE O ARMÁRIO EXISTE
    const armarioExiste = await this.estoqueInsumoRepository.armarioExiste(validArmarioId);
    if (!armarioExiste) {
      throw new Error('Armário não encontrado.');
    }

    // 5. REGISTRA A ENTRADA
    const resultado = await this.estoqueInsumoRepository.registrarEntrada({
      insumo_id: validInsumoId,
      armario_id: validArmarioId,
      quantidade: validQuantidade
    });

    await this.movimentacaoService.registrar({
      tipo: 'entrada_insumo',
      insumo_id: validInsumoId,
      medicamento_id: null,
      casela_id: null,
      armario_id: validArmarioId,
      validade_medicamento: null,
      quantidade: validQuantidade,
      login_id: entradaData.login_id 
    });    
    return resultado;
  }

  /**
   * Registra saída de insumo do estoque.
   * @param {object} saidaData - Dados da saída
   * @returns {Promise<object>} Resultado da operação
   */
  async registrarSaida(saidaData) {
    // 1. VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
    const { insumo_id, armario_id, quantidade } = saidaData;

    if (!insumo_id) {
      throw new Error('O campo insumo_id é obrigatório.');
    }

    if (!armario_id) {
      throw new Error('O campo armario_id é obrigatório.');
    }

    if (quantidade === undefined || quantidade === null) {
      throw new Error('O campo quantidade é obrigatório.');
    }

    // 2. VALIDAÇÃO DOS TIPOS E VALORES
    const validInsumoId = Number(insumo_id);
    const validArmarioId = Number(armario_id);
    const validQuantidade = Number(quantidade);

    if (isNaN(validInsumoId) || validInsumoId <= 0) {
      throw new Error('O insumo_id deve ser um número positivo.');
    }

    if (isNaN(validArmarioId) || validArmarioId <= 0) {
      throw new Error('O armario_id deve ser um número positivo.');
    }

    if (isNaN(validQuantidade) || validQuantidade <= 0) {
      throw new Error('A quantidade deve ser um número positivo.');
    }

    // 3. VERIFICA SE O INSUMO EXISTE
    const insumoExiste = await this.estoqueInsumoRepository.insumoExiste(validInsumoId);
    if (!insumoExiste) {
      throw new Error('Insumo não encontrado.');
    }

    // 4. VERIFICA SE O ARMÁRIO EXISTE
    const armarioExiste = await this.estoqueInsumoRepository.armarioExiste(validArmarioId);
    if (!armarioExiste) {
      throw new Error('Armário não encontrado.');
    }

    // 5. REGISTRA A SAÍDA
    const resultado = await this.estoqueInsumoRepository.registrarSaida({
      insumo_id: validInsumoId,
      armario_id: validArmarioId,
      quantidade: validQuantidade
    });

    await this.movimentacaoService.registrar({
      tipo: 'saida_insumo',
      insumo_id: validInsumoId,
      medicamento_id: null,
      casela_id: null,
      armario_id: validArmarioId,
      validade_medicamento: null,
      quantidade: validQuantidade,
      login_id: saidaData.login_id
    });

    return resultado;
  }
}

module.exports = EstoqueInsumoService;

