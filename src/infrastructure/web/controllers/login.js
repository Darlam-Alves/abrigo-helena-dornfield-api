class LoginController {
    constructor(loginService) {
      this.loginService = loginService;
    }
  
  async getAll(req, res) {
    try {
      const logins = await this.loginService.listarTodos();
      // Remove o campo password de todos os usuários
      const loginsSemSenha = logins.map(login => ({
        id: login.id,
        login: login.login
      }));
      res.status(200).json(loginsSemSenha);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  
  async create(req, res) {
    try {
      const novo = await this.loginService.cadastrarNovo(req.body);
      // Não retorna o password por segurança
      res.status(201).json({
        id: novo.id,
        login: novo.login
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  
    async auth(req, res) {
      try {
        const { login, password } = req.body;
  
        const user = await this.loginService.autenticar(login, password);
  
        res.status(200).json({ 
          message: 'Login realizado com sucesso.',
          user: { id: user.id, login: user.login }
        });
      } catch (err) {
        res.status(401).json({ message: err.message });
      }
    }
  
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const atualizado = await this.loginService.atualizar(id, req.body);
      // Não retorna o password por segurança
      res.status(200).json({
        id: atualizado.id,
        login: atualizado.login,
        message: 'Usuário atualizado com sucesso.'
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  }
  
  module.exports = LoginController;
  