class ResidenteController {
  constructor(residenteService) {
    this.residenteService = residenteService;
  }

  async findAll(req, res) {
    try {
      const residentes = await this.residenteService.findAll();
      res.status(200).json(residentes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findByCasela(req, res) {
    try {
      const casela = parseInt(req.params.casela);
      const residente = await this.residenteService.findByCasela(casela);
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
      const residenteData = req.body;
      const newResidente = await this.residenteService.create(residenteData);
      res.status(201).json(newResidente);
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
      const casela = parseInt(req.params.casela);
      const residenteData = { ...req.body, casela };
      const updatedResidente = await this.residenteService.update(residenteData);
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
      const casela = parseInt(req.params.casela);
      await this.residenteService.delete(casela);
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