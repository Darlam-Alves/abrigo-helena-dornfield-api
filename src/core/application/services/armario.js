class ArmarioService {
  constructor(armarioRepository) {
    this.armarioRepository = armarioRepository;
  }

  /**
   * Cadastra um novo armário após validar os dados.
   * @param {object} armarioData - Dados do armário vindos do controller.
   * @returns {Promise<object>} O novo armário criado.
   */
  async cadastrarNovo(armarioData) {
    // 1. APLICAÇÃO DA LÓGICA DE NEGÓCIO (VALIDAÇÃO)
    if (!armarioData.numero || !armarioData.categoria) {
      throw new Error('Número e categoria são campos obrigatórios.');
    }
    
    if (typeof armarioData.numero !== 'number' || armarioData.numero <= 0) {
      throw new Error('O número do armário deve ser um valor positivo.');
    }

    // 2. ORQUESTRAÇÃO DA AÇÃO
    const novoArmario = await this.armarioRepository.create(armarioData);

    // 3. RETORNO
    return novoArmario;
  }

  /**
   * Lista todos os armários.
   * @returns {Promise<Array>} Lista de armários.
   */
  async listarTodos() {
    const armarios = await this.armarioRepository.findAll();
    return armarios;
  }

  /**
   * Busca um armário pelo número.
   * @param {number} numero - Número do armário.
   * @returns {Promise<object>} O armário encontrado.
   */
  async buscarPorNumero(numero) {
    // VALIDAÇÃO
    if (!numero || typeof numero !== 'number' || numero <= 0) {
      throw new Error('Número do armário inválido.');
    }

    // BUSCA NO REPOSITÓRIO
    const armario = await this.armarioRepository.findById(numero);
    
    if (!armario) {
      throw new Error('Armário não encontrado.');
    }

    return armario;
  }

  /**
   * Deleta um armário após validações.
   * @param {number} numero - Número do armário a deletar.
   * @returns {Promise<boolean>} true se deletado com sucesso.
   */
  async deletar(numero) {
    // 1. VALIDAÇÃO DO NÚMERO
    if (!numero || typeof numero !== 'number' || numero <= 0) {
      throw new Error('Número do armário inválido.');
    }

    // 2. VERIFICA SE O ARMÁRIO EXISTE
    const armario = await this.armarioRepository.findById(numero);
    if (!armario) {
      throw new Error('Armário não encontrado.');
    }

    // 3. VERIFICA SE O ARMÁRIO CONTÉM ITENS
    const hasItems = await this.armarioRepository.hasItems(numero);
    if (hasItems) {
      throw new Error('Não é possível deletar o armário pois ele contém insumos ou medicamentos. Remova os itens primeiro.');
    }

    // 4. DELETA O ARMÁRIO
    const deleted = await this.armarioRepository.delete(numero);
    
    if (!deleted) {
      throw new Error('Erro ao deletar armário.');
    }

    return true;
  }
}

module.exports = ArmarioService;

