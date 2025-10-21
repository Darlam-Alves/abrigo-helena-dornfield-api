class Medicamento {
    constructor(id, nome, dosagem, unidade_medida, substancia) {
      this.id = id;
      this.nome = nome;
      this.dosagem = dosagem;
      this.unidade_medida = unidade_medida;
      this.substancia = substancia;
    }
  }
  
  module.exports = Medicamento;