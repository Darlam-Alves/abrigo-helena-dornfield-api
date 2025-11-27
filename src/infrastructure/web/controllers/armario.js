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

  /**
   * Handler para a rota GET /armarios.
   * Lista todos os armários cadastrados.
   */
  async getAll(req, res) {
    try {
      const armarios = await this.armarioService.listarTodos();
      res.status(200).json(armarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Handler para a rota GET /armarios/:numero.
   * Busca um armário específico pelo número.
   */
  async getByNumero(req, res) {
    try {
      const numero = parseInt(req.params.numero);
      const armario = await this.armarioService.buscarPorNumero(numero);
      res.status(200).json(armario);
    } catch (error) {
      if (error.message === 'Armário não encontrado.') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  /**
   * Handler para a rota DELETE /armarios/:numero.
   * Deleta um armário específico pelo número.
   */
  async delete(req, res) {
    try {
      const numero = parseInt(req.params.numero);
      await this.armarioService.deletar(numero);
      res.status(200).json({ message: 'Armário deletado com sucesso.' });
    } catch (error) {
      if (error.message === 'Armário não encontrado.') {
        res.status(404).json({ message: error.message });
      } else if (error.message.includes('contém insumos ou medicamentos')) {
        res.status(409).json({ message: error.message }); // 409 Conflict
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

module.exports = ArmarioController;

