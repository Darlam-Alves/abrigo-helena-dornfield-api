class EstoqueInsumoController {
  constructor(estoqueInsumoService) {
    this.estoqueInsumoService = estoqueInsumoService;
  }

  /**
   * Handler para a rota GET /insumos.
   * Lista todos os insumos cadastrados.
   */
  async getAll(req, res) {
  try {
    const estoqueInsumos = await this.estoqueInsumoService.listarTodos();
    res.status(200).json(estoqueInsumos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

  /**
   * Handler para a rota POST /estoque-insumos/entrada.
   * Registra entrada de insumo no estoque.
   */
  async entrada(req, res) {
    try {
      const dadosEntrada = req.body;

      const resultado = await this.estoqueInsumoService.registrarEntrada(dadosEntrada);

      res.status(201).json({
        message: 'Entrada registrada com sucesso!',
        data: resultado
      });

    } catch (error) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('obrigatório') || error.message.includes('deve ser')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * Handler para a rota POST /estoque-insumos/saida.
   * Registra saída de insumo do estoque.
   */
  async saida(req, res) {
    try {
      const dadosSaida = req.body;

      const resultado = await this.estoqueInsumoService.registrarSaida(dadosSaida);

      res.status(200).json({
        message: 'Saída registrada com sucesso!',
        data: resultado
      });

    } catch (error) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('insuficiente')) {
        res.status(409).json({ error: error.message }); // 409 Conflict
      } else if (error.message.includes('obrigatório') || error.message.includes('deve ser')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = EstoqueInsumoController;

