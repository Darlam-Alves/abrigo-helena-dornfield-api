class Medicamento {
    constructor(id, nome, dosagem, unidade_medida, principio_ativo, estoque_minimo) {
      this.id = id;
      this.nome = nome;
      this.dosagem = dosagem;
      this.unidade_medida = unidade_medida;
      this.principio_ativo = principio_ativo;
      this.estoque_minimo = estoque_minimo;
    }
  }
  
  module.exports = Medicamento;