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

  // async listarTodos() { ... }
  // async buscarPorNumero(numero) { ... }
}

module.exports = ArmarioService;

