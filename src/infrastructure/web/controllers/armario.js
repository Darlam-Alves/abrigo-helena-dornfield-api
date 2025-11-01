class ArmarioController {
  constructor(armarioService) {
    this.armarioService = armarioService;
  }

  /**
   * Handler para a rota POST /armarios.
   * Recebe os dados do corpo da requisição e chama o serviço para criar um novo armário.
   */
  async create(req, res) {

    try {
      // 1. EXTRAI OS DADOS DA REQUISIÇÃO
      const dadosDoArmario = req.body;

      // 2. CHAMA O SERVIÇO
      const novoArmario = await this.armarioService.cadastrarNovo(dadosDoArmario);

      // 3. ENVIA A RESPOSTA DE SUCESSO
      res.status(201).json(novoArmario);

    } catch (error) {
      // 4. ENVIA A RESPOSTA DE ERRO
      res.status(400).json({ message: error.message });
    }
  }

  // async getAll(req, res) { ... }
  // async getByNumero(req, res) { ... }
}

module.exports = ArmarioController;

