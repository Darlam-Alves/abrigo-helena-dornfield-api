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

    /**
     * Handler para a rota GET /insumos.
     * Lista todos os insumos cadastrados.
     */
    async getAll(req, res) {
      try {
        const insumos = await this.insumoService.listarTodos();
        res.status(200).json(insumos);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }    
  
    /**
     * Handler para a rota GET /insumo/:id.
     * Busca um insumos específico pelo ID.
     */
    async getById(req, res) {
      try {
        const id = parseInt(req.params.id);
        const insumo = await this.insumoService.buscarPorId(id);
        res.status(200).json(insumo);
      } catch (error) {
        if (error.message === 'Insumo não encontrado.') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }   

    /**
     * Handler para a rota PUT/PATCH /insumo/:id.
     * Atualiza um insumo específico pelo ID.
     */
    async update(req, res) {
      try {
        const id = parseInt(req.params.id);
        const dadosDoInsumo = req.body;
        
        const insumoAtualizado = await this.insumoService.atualizar(id, dadosDoInsumo);
        res.status(200).json(insumoAtualizado);
      } catch (error) {
        if (error.message === 'Insumo não encontrado.') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }  
    
    /**
     * Handler para a rota DELETE /insumos/:id.
     * Deleta um insumo específico pelo ID.
     */
    async delete(req, res) {
      try {
        const id = parseInt(req.params.id);
        await this.insumoService.deletar(id);
        res.status(200).json({ message: 'Insumo deletado com sucesso.' });
      } catch (error) {
        if (error.message === 'Insumocontrado.') {
          res.status(404).json({ message: error.message });
        } else if (error.message.includes('está em estoque ou possui movimentações')) {
          res.status(409).json({ message: error.message }); // 409 Conflict
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }    
  }
  
  module.exports = InsumoController;