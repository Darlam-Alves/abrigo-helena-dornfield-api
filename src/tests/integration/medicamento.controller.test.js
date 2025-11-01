// Testes de Integração para o MedicamentoController

const request = require('supertest');
const express = require('express');
const MedicamentoController = require('../../infrastructure/web/controllers/medicamento');

// Mock do Sequelize connection para evitar tentativa de conexão ao banco durante testes
jest.mock('../../infrastructure/database/connection', () => {
  return {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn()
  };
});

describe('MedicamentoController - Testes de Integração', () => {
  let app;
  let medicamentoController;
  let mockMedicamentoService;

  beforeEach(() => {
    // Cria uma nova instância do app Express para cada teste
    app = express();
    app.use(express.json());

    // Cria mock do service
    mockMedicamentoService = {
      cadastrarNovo: jest.fn()
    };

    // Cria controller com o service mockado
    medicamentoController = new MedicamentoController(mockMedicamentoService);

    // Configura as rotas
    app.post('/api/medicamentos', (req, res) => medicamentoController.create(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/medicamentos', () => {
    it('deve retornar 201 e o medicamento criado quando os dados são válidos', async () => {
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

      mockMedicamentoService.cadastrarNovo.mockResolvedValue(medicamentoCriado);

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect('Content-Type', /json/)
        .expect(201);

      // Assert
      expect(response.body).toEqual(medicamentoCriado);
      expect(mockMedicamentoService.cadastrarNovo).toHaveBeenCalledWith(medicamentoData);
      expect(mockMedicamentoService.cadastrarNovo).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 400 quando o nome não é fornecido', async () => {
      // Arrange
      const medicamentoData = {
        dosagem: 500,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('Nome, dosagem e unidade de medida são campos obrigatórios.')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect('Content-Type', /json/)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Nome, dosagem e unidade de medida são campos obrigatórios.');
      expect(mockMedicamentoService.cadastrarNovo).toHaveBeenCalledWith(medicamentoData);
    });

    it('deve retornar 400 quando a dosagem não é fornecida', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('Nome, dosagem e unidade de medida são campos obrigatórios.')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect(400);

      // Assert
      expect(response.body.message).toBe('Nome, dosagem e unidade de medida são campos obrigatórios.');
    });

    it('deve retornar 400 quando a unidade de medida não é fornecida', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        estoque_minimo: 50
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('Nome, dosagem e unidade de medida são campos obrigatórios.')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect(400);

      // Assert
      expect(response.body.message).toBe('Nome, dosagem e unidade de medida são campos obrigatórios.');
    });

    it('deve retornar 400 quando a dosagem é zero', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 0,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('A dosagem deve ser um valor positivo.')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect(400);

      // Assert
      expect(response.body.message).toBe('A dosagem deve ser um valor positivo.');
    });

    it('deve retornar 400 quando a dosagem é negativa', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: -100,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('A dosagem deve ser um valor positivo.')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect(400);

      // Assert
      expect(response.body.message).toBe('A dosagem deve ser um valor positivo.');
    });

    it('deve criar medicamento sem princípio ativo', async () => {
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

      mockMedicamentoService.cadastrarNovo.mockResolvedValue(medicamentoCriado);

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect(201);

      // Assert
      expect(response.body).toEqual(medicamentoCriado);
      expect(response.body.principio_ativo).toBeNull();
    });

    it('deve retornar 400 com mensagem de erro do banco de dados', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Paracetamol',
        dosagem: 500,
        unidade_medida: 'mg',
        estoque_minimo: 50
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('Erro ao criar medicamento no banco de dados: ECONNREFUSED')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect(400);

      // Assert
      expect(response.body.message).toContain('Erro ao criar medicamento no banco de dados');
    });

    it('deve aceitar e processar corpo JSON válido', async () => {
      // Arrange
      const medicamentoData = {
        nome: 'Aspirina',
        dosagem: 100,
        unidade_medida: 'mg',
        principio_ativo: 'Ácido Acetilsalicílico',
        estoque_minimo: 25
      };

      const medicamentoCriado = {
        id: 5,
        ...medicamentoData
      };

      mockMedicamentoService.cadastrarNovo.mockResolvedValue(medicamentoCriado);

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(medicamentoData))
        .expect(201);

      // Assert
      expect(response.body.nome).toBe('Aspirina');
      expect(response.body.dosagem).toBe(100);
    });

    it('deve processar requisição com diferentes unidades de medida', async () => {
      // Arrange
      const unidadesDeMedida = [
        { unidade: 'mg', nome: 'Medicamento em miligramas' },
        { unidade: 'ml', nome: 'Medicamento em mililitros' },
        { unidade: 'g', nome: 'Medicamento em gramas' },
        { unidade: 'mcg', nome: 'Medicamento em microgramas' }
      ];

      for (const { unidade, nome } of unidadesDeMedida) {
        const medicamentoData = {
          nome: nome,
          dosagem: 100,
          unidade_medida: unidade,
          estoque_minimo: 10
        };

        const medicamentoCriado = {
          id: 1,
          ...medicamentoData
        };

        mockMedicamentoService.cadastrarNovo.mockResolvedValue(medicamentoCriado);

        // Act
        const response = await request(app)
          .post('/api/medicamentos')
          .send(medicamentoData)
          .expect(201);

        // Assert
        expect(response.body.unidade_medida).toBe(unidade);
      }
    });

    it('deve retornar JSON mesmo em caso de erro', async () => {
      // Arrange
      const medicamentoData = {
        nome: '',
        dosagem: 500,
        unidade_medida: 'mg'
      };

      mockMedicamentoService.cadastrarNovo.mockRejectedValue(
        new Error('Nome, dosagem e unidade de medida são campos obrigatórios.')
      );

      // Act
      const response = await request(app)
        .post('/api/medicamentos')
        .send(medicamentoData)
        .expect('Content-Type', /json/)
        .expect(400);

      // Assert
      expect(typeof response.body).toBe('object');
      expect(response.body).toHaveProperty('message');
    });
  });
});

