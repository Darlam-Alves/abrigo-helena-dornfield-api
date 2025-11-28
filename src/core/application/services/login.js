const bcrypt = require('bcrypt');

class LoginService {
  constructor(loginRepository) {
    this.loginRepository = loginRepository;
  }

  async listarTodos() {
    return await this.loginRepository.findAll();
  }

  async cadastrarNovo(data) {
    if (!data.login || !data.password) {
      throw new Error('Login e senha são obrigatórios.');
    }

    // gerar hash
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.loginRepository.create({
      login: data.login,
      password: hashedPassword
    });
  }

  async autenticar(login, password) {
    const user = await this.loginRepository.findByLogin(login);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const senhaCorreta = await bcrypt.compare(password, user.password);

    if (!senhaCorreta) {
      throw new Error('Senha incorreta.');
    }

    return user;
  }

  async atualizar(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.loginRepository.update(id, data);

    return await this.loginRepository.findById(id);
  }
}

module.exports = LoginService;
