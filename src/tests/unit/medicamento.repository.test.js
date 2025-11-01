// Testes de Unidade para o PostgresMedicamentoRepository

const PostgresMedicamentoRepository = require('../../infrastructure/database/repositories/PostgresMedicamentoRepository');
const MedicamentoModel = require('../../infrastructure/database/models/medicamento');
const Medicamento = require('../../core/domain/medicamento');

// Mock do MedicamentoModel (Sequelize)
jest.mock('../../infrastructure/database/models/medicamento');

describe('PostgresMedicamentoRepository', () => {
  let repository;

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
    repository = new PostgresMedicamentoRepository();
  });

  describe('create', () => {
    it('deve criar um medicamento no banco de dados e retornar uma entidade de domínio', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        principio_ativo: 'Paracetamol',
        estoque_minimo: 50
      };

      const medicamentoRecord = {
        id: 1,
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        principio_ativo: 'Paracetamol',
        estoque_minimo: 50
      };

      MedicamentoModel.create.mockResolvedValue(medicamentoRecord);

      // Act
      const resultado = await repository.create(medicamentoData);

      // Assert
      expect(MedicamentoModel.create).toHaveBeenCalledWith({
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        principio_ativo: 'Paracetamol',
        estoque_minimo: 50
      });
      expect(MedicamentoModel.create).toHaveBeenCalledTimes(1);
      expect(resultado).toBeInstanceOf(Medicamento);
      expect(resultado.id).toBe(1);
      expect(resultado.nome).toBe('Paracetamol');
      expect(resultado.dosagem).toBe(500);
      expect(resultado.unidade_medida).toBe('mg');
      expect(resultado.principio_ativo).toBe('Paracetamol');
      expect(resultado.estoque_minimo).toBe(50);
    });

    it('deve criar medicamento com princípio ativo null quando não fornecido', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Ibuprofeno',
        dosagem: 400,
        unidade_medida: 'mg',
        estoque_minimo: 30
      };

      const medicamentoRecord = {
        id: 2,
        nome: 'Ibuprofeno',
        dosagem: 400,
        unidade_medida: 'mg',
        principio_ativo: null,
        estoque_minimo: 30
      };

      MedicamentoModel.create.mockResolvedValue(medicamentoRecord);

      // Act
      const resultado = await repository.create(medicamentoData);

      // Assert
      expect(MedicamentoModel.create).toHaveBeenCalledWith({
        nome: 'Ibuprofeno',
        dosagem: 400,
        unidade_medida: 'mg',
        principio_ativo: null,
        estoque_minimo: 30
      });
      expect(resultado.principio_ativo).toBeNull();
    });

    it('deve definir princípio ativo como null explicitamente quando undefined', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Dipirona',
        dosagem: 500,
        unidade_medida: 'mg',
        principio_ativo: undefined,
        estoque_minimo: 40
      };

      const medicamentoRecord = {
        id: 3,
        nome: 'Dipirona',
        dosagem: 500,
        unidade_medida: 'mg',
        principio_ativo: null,
        estoque_minimo: 40
      };

      MedicamentoModel.create.mockResolvedValue(medicamentoRecord);

      // Act
      const resultado = await repository.create(medicamentoData);

      // Assert
      expect(MedicamentoModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          principio_ativo: null
        })
      );
      expect(resultado.principio_ativo).toBeNull();
    });

    it('deve lançar erro personalizado quando o banco de dados falha', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      const erroOriginal = new Error('Violação de constraint');
      MedicamentoModel.create.mockRejectedValue(erroOriginal);

      // Act & Assert
      await expect(repository.create(medicamentoData))
        .rejects
        .toThrow('Erro ao criar medicamento no banco de dados: Violação de constraint');

      expect(MedicamentoModel.create).toHaveBeenCalledTimes(1);
    });

    it('deve preservar todos os dados ao criar medicamento', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Amoxicilina',
        dosagem: 875,
        unidade_medida: 'mg',
        principio_ativo: 'Amoxicilina',
        estoque_minimo: 100
      };

      const medicamentoRecord = {
        id: 10,
        ...medicamentoData
      };

      MedicamentoModel.create.mockResolvedValue(medicamentoRecord);

      // Act
      const resultado = await repository.create(medicamentoData);

      // Assert
      expect(resultado.id).toBe(10);
      expect(resultado.nome).toBe(medicamentoData.nome);
      expect(resultado.dosagem).toBe(medicamentoData.dosagem);
      expect(resultado.unidade_medida).toBe(medicamentoData.unidade_medida);
      expect(resultado.principio_ativo).toBe(medicamentoData.principio_ativo);
      expect(resultado.estoque_minimo).toBe(medicamentoData.estoque_minimo);
    });

    it('deve lidar com erro de conexão do banco de dados', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Aspirina',
        dosagem: 100,
        unidade_medida: 'mg',
        estoque_minimo: 20
      };

      const erroConexao = new Error('ECONNREFUSED');
      MedicamentoModel.create.mockRejectedValue(erroConexao);

      // Act & Assert
      await expect(repository.create(medicamentoData))
        .rejects
        .toThrow('Erro ao criar medicamento no banco de dados: ECONNREFUSED');
    });

    it('deve converter valores corretamente ao criar entidade de domínio', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Losartana',
        dosagem: 50,
        unidade_medida: 'mg',
        principio_ativo: 'Losartana Potássica',
        estoque_minimo: 60
      };

      // Simula o que o Sequelize retorna (pode ter métodos adicionais, toJSON, etc.)
      const medicamentoRecord = {
        id: 7,
        nome: 'Losartana',
        dosagem: 50,
        unidade_medida: 'mg',
        principio_ativo: 'Losartana Potássica',
        estoque_minimo: 60,
        // Propriedades adicionais do Sequelize (são ignoradas)
        dataValues: {},
        _previousDataValues: {},
        uniqno: 1
      };

      MedicamentoModel.create.mockResolvedValue(medicamentoRecord);

      // Act
      const resultado = await repository.create(medicamentoData);

      // Assert
      expect(resultado).toBeInstanceOf(Medicamento);
      // Verifica que apenas as propriedades relevantes foram usadas
      expect(resultado).toHaveProperty('id');
      expect(resultado).toHaveProperty('nome');
      expect(resultado).toHaveProperty('dosagem');
      expect(resultado).toHaveProperty('unidade_medida');
      expect(resultado).toHaveProperty('principio_ativo');
      expect(resultado).toHaveProperty('estoque_minimo');
      // Não deve ter propriedades do Sequelize
      expect(resultado).not.toHaveProperty('dataValues');
      expect(resultado).not.toHaveProperty('_previousDataValues');
    });
  });
});

