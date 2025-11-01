// Testes de Unidade para o MedicamentoService

const MedicamentoService = require('../../core/application/services/medicamento');

describe('MedicamentoService', () => {
  let medicamentoService;
  let mockMedicamentoRepository;

  beforeEach(() => {
    // Cria um mock do repository antes de cada teste
    mockMedicamentoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    medicamentoService = new MedicamentoService(mockMedicamentoRepository);
  });

  describe('cadastrarNovo', () => {
    it('deve cadastrar um medicamento com dados válidos', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        principio_ativo: 'Paracetamol',
        estoque_minimo: 50
      };

      const medicamentoCriado = {
        id: 1,
        ...medicamentoData
      };

      mockMedicamentoRepository.create.mockResolvedValue(medicamentoCriado);

      // Act
      const resultado = await medicamentoService.cadastrarNovo(medicamentoData);

      // Assert
      expect(mockMedicamentoRepository.create).toHaveBeenCalledWith(medicamentoData);
      expect(mockMedicamentoRepository.create).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(medicamentoCriado);
    });

    it('deve lançar erro se o nome não for fornecido', async () => {
      // Arrange
      const medicamentoData = {
        dosagem: 500,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('Nome, dosagem e unidade de medida são campos obrigatórios.');

      expect(mockMedicamentoRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro se a dosagem não for fornecida', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('Nome, dosagem e unidade de medida são campos obrigatórios.');

      expect(mockMedicamentoRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro se a unidade de medida não for fornecida', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        estoque_minimo: 50
      };

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('Nome, dosagem e unidade de medida são campos obrigatórios.');

      expect(mockMedicamentoRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro se a dosagem for zero', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 0,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('A dosagem deve ser um valor positivo.');

      expect(mockMedicamentoRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro se a dosagem for negativa', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: -100,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('A dosagem deve ser um valor positivo.');

      expect(mockMedicamentoRepository.create).not.toHaveBeenCalled();
    });

    it('deve cadastrar medicamento sem princípio ativo', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Medicamento Genérico',
        dosagem: 250,
        unidade_medida: 'ml',
        estoque_minimo: 20
      };

      const medicamentoCriado = {
        id: 2,
        ...medicamentoData,
        principio_ativo: null
      };

      mockMedicamentoRepository.create.mockResolvedValue(medicamentoCriado);

      // Act
      const resultado = await medicamentoService.cadastrarNovo(medicamentoData);

      // Assert
      expect(mockMedicamentoRepository.create).toHaveBeenCalledWith(medicamentoData);
      expect(resultado).toEqual(medicamentoCriado);
    });

    it('deve propagar erro do repository', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      const erroRepository = new Error('Erro ao conectar ao banco de dados');
      mockMedicamentoRepository.create.mockRejectedValue(erroRepository);

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('Erro ao conectar ao banco de dados');

      expect(mockMedicamentoRepository.create).toHaveBeenCalledWith(medicamentoData);
    });

    it('deve validar campos vazios (strings vazias)', async () => {
      // Arrange
      const medicamentoData = {
        nome: '',
        dosagem: 500,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      // Act & Assert
      await expect(medicamentoService.cadastrarNovo(medicamentoData))
        .rejects
        .toThrow('Nome, dosagem e unidade de medida são campos obrigatórios.');

      expect(mockMedicamentoRepository.create).not.toHaveBeenCalled();
    });

    it('deve aceitar diferentes unidades de medida', async () => {
      // Arrange
      const unidadesDeMedida = ['mg', 'ml', 'g', 'l', 'mcg', 'UI'];

      for (const unidade of unidadesDeMedida) {
        const medicamentoData = {
          nome: `Medicamento ${unidade}`,
          dosagem: 100,
          unidade_medida: unidade,
          estoque_minimo: 10
        };

        const medicamentoCriado = {
          id: 1,
          ...medicamentoData
        };

        mockMedicamentoRepository.create.mockResolvedValue(medicamentoCriado);

        // Act
        const resultado = await medicamentoService.cadastrarNovo(medicamentoData);

        // Assert
        expect(resultado.unidade_medida).toBe(unidade);
      }
    });
  });
});

