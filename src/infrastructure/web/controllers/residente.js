class ResidenteController {
  constructor(residenteService) {
    this.residenteService = residenteService;
  }

  async getAll(req, res) {
    try {
      const residentes = await this.residenteService.listarTodos();
      res.status(200).json(residentes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByCasela(req, res) {
    try {
      const num_casela = parseInt(req.params.num_casela);
      const residente = await this.residenteService.buscarPorCasela(num_casela);
      res.status(200).json(residente);
    } catch (error) {
      if (error.message === 'Residente não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async create(req, res) {
    try {
      const dadosDoResidente = req.body;
      const novoResidente = await this.residenteService.cadastrarNovo(dadosDoResidente);
      res.status(201).json(novoResidente);
    } catch (error) {
      if (error.message.includes('Já existe um residente')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async update(req, res) {
    try {
      const num_casela = parseInt(req.params.casela);
      const residenteData = { ...req.body, num_casela };
      const updatedResidente = await this.residenteService.atualizar(residenteData);
      res.status(200).json(updatedResidente);
    } catch (error) {
      if (error.message === 'Residente não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async delete(req, res) {
    try {
      const num_casela = parseInt(req.params.casela);
      await this.residenteService.deletar(num_casela);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Residente não encontrado') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = ResidenteController;