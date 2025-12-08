class MovimentacaoController {
    constructor(movimentacaoService) {
      this.movimentacaoService = movimentacaoService;
    }

    async getMedicamentos(req, res) {
      try {
        const data = await this.movimentacaoService.listarMedicamentos();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    
    async getInsumos(req, res) {
      try {
        const data = await this.movimentacaoService.listarInsumos();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    

  // POST /movimentacoes
  async registrar(req, res) {
    try {
      const dados = {
        ...req.body,
        login_id: req.user.id
      };

      const novaMovimentacao = await this.movimentacaoService.registrar(dados);

      res.status(201).json(novaMovimentacao);

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }    
  
  async registrarEntrada(req, res) {
    try {
      
      // garante que login_id não precise vir no body
      const data = {
        ...req.body,
        login_id: req.user.id
      };
  
      const resultado = await this.movimentacaoService.registrarEntrada(data);
  
      return res.status(201).json(resultado);
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
    /**
     * Handler para a rota POST /medicamentos.
     * Recebe os dados do corpo da requisição e chama o serviço para criar um novo medicamento.
     */
    async create(req, res) {

      try {
        // 1. EXTRAI OS DADOS DA REQUISIÇÃO
        const dadosDaMovimentacao = req.body;
  
        // 2. CHAMA O SERVIÇO
        const novaMovimentacao = await this.movimentacaoService.cadastrarNovo(dadosDaMovimentacao);
  
        // 3. ENVIA A RESPOSTA DE SUCESSO
        res.status(201).json(novaMovimentacao);
  
      } catch (error) {
        // 4. ENVIA A RESPOSTA DE ERRO
        res.status(400).json({ message: error.message });
      }
    }
  
    /**
     * Handler para a rota GET /movimentacoes.
     * Lista todos os medicamentos cadastrados.
     */
    async getAll(req, res) {
      try {
        const movimentacoes = await this.movimentacaoService.listarTodos();
        res.status(200).json(movimentacoes);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
  
  module.exports = MovimentacaoController;