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
  
    // async getAll(req, res) { ... }
    // async getById(req, res) { ... }
  }
  
  module.exports = MedicamentoController;