class InsumoController {
    constructor(insumoService) {
      this.insumoService = insumoService;
    }
  
    /**
     * Handler para a rota POST /insumos.
     * Recebe os dados do corpo da requisição e chama o serviço para criar um novo insumo.
     */
    async create(req, res) {

      try {
        // 1. EXTRAI OS DADOS DA REQUISIÇÃO
        const dadosDoInsumo = req.body;
  
        // 2. CHAMA O SERVIÇO
        const novoInsumo = await this.insumoService.cadastrarNovo(dadosDoInsumo);
  
        // 3. ENVIA A RESPOSTA DE SUCESSO
        res.status(201).json(novoInsumo);
  
      } catch (error) {
        // 4. ENVIA A RESPOSTA DE ERRO
        res.status(400).json({ message: error.message });
      }
    }
  
    // async getAll(req, res) { ... }
    // async getById(req, res) { ... }
  }
  
  module.exports = InsumoController;