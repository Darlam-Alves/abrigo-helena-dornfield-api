class MedicamentoController {
    constructor(medicamentoService) {
      this.medicamentoService = medicamentoService;
    }
  
    /**
     * Handler para a rota POST /medicamentos.
     * Recebe os dados do corpo da requisição e chama o serviço para criar um novo medicamento.
     */
    async create(req, res) {

      try {
        // 1. EXTRAI OS DADOS DA REQUISIÇÃO
        const dadosDoMedicamento = req.body;
  
        // 2. CHAMA O SERVIÇO
        const novoMedicamento = await this.medicamentoService.cadastrarNovo(dadosDoMedicamento);
  
        // 3. ENVIA A RESPOSTA DE SUCESSO
        res.status(201).json(novoMedicamento);
  
      } catch (error) {
        // 4. ENVIA A RESPOSTA DE ERRO
        res.status(400).json({ message: error.message });
      }
    }
  
    /**
     * Handler para a rota GET /medicamentos.
     * Lista todos os medicamentos cadastrados.
     */
    async getAll(req, res) {
      try {
        const medicamentos = await this.medicamentoService.listarTodos();
        res.status(200).json(medicamentos);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }

    /**
     * Handler para a rota GET /medicamentos/:id.
     * Busca um medicamento específico pelo ID.
     */
    async getById(req, res) {
      try {
        const id = parseInt(req.params.id);
        const medicamento = await this.medicamentoService.buscarPorId(id);
        res.status(200).json(medicamento);
      } catch (error) {
        if (error.message === 'Medicamento não encontrado.') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }

    /**
     * Handler para a rota PUT/PATCH /medicamentos/:id.
     * Atualiza um medicamento específico pelo ID.
     */
    async update(req, res) {
      try {
        const id = parseInt(req.params.id);
        const dadosDoMedicamento = req.body;
        
        const medicamentoAtualizado = await this.medicamentoService.atualizar(id, dadosDoMedicamento);
        res.status(200).json(medicamentoAtualizado);
      } catch (error) {
        if (error.message === 'Medicamento não encontrado.') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }

    /**
     * Handler para a rota DELETE /medicamentos/:id.
     * Deleta um medicamento específico pelo ID.
     */
    async delete(req, res) {
      try {
        const id = parseInt(req.params.id);
        await this.medicamentoService.deletar(id);
        res.status(200).json({ message: 'Medicamento deletado com sucesso.' });
      } catch (error) {
        if (error.message === 'Medicamento não encontrado.') {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('está em estoque ou possui movimentações')) {
          res.status(409).json({ message: error.message }); // 409 Conflict
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }
  }
  
  module.exports = MedicamentoController;