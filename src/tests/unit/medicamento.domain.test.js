// Testes de Unidade para a entidade de domínio Medicamento

const Medicamento = require('../../core/domain/medicamento');

describe('Medicamento Domain Entity', () => {
  describe('Constructor', () => {
    it('deve criar uma instância de Medicamento com todos os campos', () => {
      // Arrange & Act
      const medicamento = new Medicamento(
        1,
        'Paracetamol',
        500,
        'mg',
        'Paracetamol',
        50
      );

      // Assert
      expect(medicamento.id).toBe(1);
      expect(medicamento.nome).toBe('Paracetamol');
      expect(medicamento.dosagem).toBe(500);
      expect(medicamento.unidade_medida).toBe('mg');
      expect(medicamento.principio_ativo).toBe('Paracetamol');
      expect(medicamento.estoque_minimo).toBe(50);
    });

    it('deve criar uma instância de Medicamento sem id (para novos medicamentos)', () => {
      // Arrange & Act
      const medicamento = new Medicamento(
        null,
        'Ibuprofeno',
        400,
        'mg',
        'Ibuprofeno',
        30
      );

      // Assert
      expect(medicamento.id).toBeNull();
      expect(medicamento.nome).toBe('Ibuprofeno');
      expect(medicamento.dosagem).toBe(400);
    });

    it('deve permitir criar medicamento sem princípio ativo', () => {
      // Arrange & Act
      const medicamento = new Medicamento(
        2,
        'Dipirona',
        500,
        'mg',
        null,
        40
      );

      // Assert
      expect(medicamento.principio_ativo).toBeNull();
      expect(medicamento.nome).toBe('Dipirona');
    });

    it('deve ser uma instância da classe Medicamento', () => {
      // Arrange & Act
      const medicamento = new Medicamento(1, 'Aspirina', 100, 'mg', 'Ácido Acetilsalicílico', 20);

      // Assert
      expect(medicamento).toBeInstanceOf(Medicamento);
    });
  });
});

