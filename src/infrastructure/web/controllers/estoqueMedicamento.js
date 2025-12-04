// src/infrastructure/web/controllers/estoqueMedicamento.js

class EstoqueMedicamentoController {
  constructor(estoqueMedicamentoService) {
    this.estoqueMedicamentoService = estoqueMedicamentoService;
  }

  /**
   * Handler para a rota POST /estoque-medicamentos/entrada.
   * Registra entrada de medicamento no estoque.
   */
  async entrada(req, res) {
    try {
      const dadosEntrada = req.body;

      // Ajusta campos opcionais (origem e paciente_casela)
      const dadosComCamposExtras = {
        ...dadosEntrada,
        origem: dadosEntrada.origem,
        paciente_casela: dadosEntrada.paciente_casela ?? null
      };

      const resultado = await this.estoqueMedicamentoService.registrarEntrada(
        dadosComCamposExtras
      );

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
   * Handler para a rota POST /estoque-medicamentos/saida.
   * Registra saída de medicamento do estoque.
   */
  async saida(req, res) {
    try {
      const dadosSaida = req.body;

      const dadosComCamposExtras = {
        ...dadosSaida,
        origem: dadosSaida.origem,
        paciente_casela: dadosSaida.paciente_casela ?? null
      };

      const resultado = await this.estoqueMedicamentoService.registrarSaida(
        dadosComCamposExtras
      );

      res.status(200).json({
        message: 'Saída registrada com sucesso!',
        data: resultado
      });

    } catch (error) {
      if (error.message.includes('não encontrado')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('insuficiente')) {
        res.status(409).json({ error: error.message });
      } else if (error.message.includes('obrigatório') || error.message.includes('deve ser')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = EstoqueMedicamentoController;
