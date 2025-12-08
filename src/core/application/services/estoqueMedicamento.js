// src/core/application/services/estoqueMedicamento.js

class EstoqueMedicamentoService {
    constructor(estoqueMedicamentoRepository, movimentacaoService) {
      this.estoqueMedicamentoRepository = estoqueMedicamentoRepository;
      this.movimentacaoService = movimentacaoService;
    }

    async listarTodos() {
      const estoqueMedicamentos = await this.estoqueMedicamentoRepository.findAll();
      return estoqueMedicamentos;
    }
  
    /**
     * Registra entrada de medicamento no estoque.
     * @param {object} entradaData - Dados da entrada
     * @returns {Promise<object>} Resultado da operação
     */
    async registrarEntrada(entradaData) {
        console.log("movService:", this.movimentacaoService)
        const { medicamento_id, armario_id, quantidade, validade, origem, paciente_casela, tipo } = entradaData;
      
        // 1. CAMPOS OBRIGATÓRIOS
        if (!medicamento_id) throw new Error('O campo medicamento_id é obrigatório.');
        if (!armario_id) throw new Error('O campo armario_id é obrigatório.');
        if (quantidade === undefined || quantidade === null) throw new Error('O campo quantidade é obrigatório.');
        if (!validade) throw new Error('O campo validade é obrigatório.');
        if (!origem) throw new Error('O campo origem é obrigatório.');
        if (!tipo) throw new Error('O campo tipo é obrigatório.');
      
        // 2. VALIDAR TIPO
        const tiposPermitidos = ['individual', 'geral'];
        if (!tiposPermitidos.includes(tipo.toLowerCase())) {
          throw new Error('O tipo deve ser: individual ou geral.');
        }
      
        // 3. ORIGEM
        const origensPermitidas = ['família', 'autocusto', 'ubs', 'farmácia popular'];
        if (!origensPermitidas.includes(origem.toLowerCase())) {
          throw new Error('A origem deve ser: família, autocusto, ubs ou farmácia popular.');
        }
      
        // 4. VALIDAR TIPOS NUMÉRICOS
        const validMedicamentoId = Number(medicamento_id);
        const validArmarioId = Number(armario_id);
        const validQuantidade = Number(quantidade);
      
        if (isNaN(validMedicamentoId) || validMedicamentoId <= 0)
          throw new Error('O medicamento_id deve ser um número positivo.');
      
        if (isNaN(validArmarioId) || validArmarioId <= 0)
          throw new Error('O armario_id deve ser um número positivo.');
      
        if (isNaN(validQuantidade) || validQuantidade <= 0)
          throw new Error('A quantidade deve ser um número positivo.');
      
        // 5. VALIDAR VALIDADE
        let dataValidade;
        if (validade.includes('/')) {
          const [dia, mes, ano] = validade.split('/');
          dataValidade = new Date(`${ano}-${mes}-${dia}`);
        } else {
          dataValidade = new Date(validade);
        }
      
        if (isNaN(dataValidade.getTime()))
          throw new Error('Validade inválida. Use YYYY-MM-DD ou DD/MM/YYYY.');
      
        // 6. VALIDAR CASSELA + TIPO
        let validNumCasela = null;
      
        if (tipo.toLowerCase() === 'individual') {
          // casela obrigatória
          if (!paciente_casela && paciente_casela !== 0)
            throw new Error('O campo paciente_casela é obrigatório quando tipo é individual.');
      
          validNumCasela = Number(paciente_casela);
      
          if (isNaN(validNumCasela) || validNumCasela <= 0)
            throw new Error('O campo paciente_casela deve ser um número positivo.');
      
          const existe = await this.estoqueMedicamentoRepository.caselaExiste(validNumCasela);
          if (!existe) throw new Error('Residente (paciente_casela) não encontrado.');
        }
      
        if (tipo.toLowerCase() === 'geral') {
          if (paciente_casela !== null && paciente_casela !== undefined) {
            throw new Error('Quando tipo é "geral", o campo paciente_casela não deve ser preenchido.');
          }
          validNumCasela = null;
        }
      
        // 7. VALIDAR MEDICAMENTO
        const medicamentoExiste = await this.estoqueMedicamentoRepository.medicamentoExiste(validMedicamentoId);
        if (!medicamentoExiste) throw new Error('Medicamento não encontrado.');
      
        // 8. VALIDAR ARMÁRIO
        const armarioExiste = await this.estoqueMedicamentoRepository.armarioExiste(validArmarioId);
        if (!armarioExiste) throw new Error('Armário não encontrado.');
      
        // 9. REGISTRAR
        const result = await this.estoqueMedicamentoRepository.registrarEntrada({
          medicamento_id: validMedicamentoId,
          armario_id: validArmarioId,
          quantidade: validQuantidade,
          validade: dataValidade,
          origem,
          casela_id: validNumCasela,
          tipo: tipo.toLowerCase()
        });

        await this.movimentacaoService.registrar({
          tipo: "entrada_medicamento",
          medicamento_id: validMedicamentoId,
          insumo_id: null,
          casela_id: validNumCasela,
          armario_id: validArmarioId,
          validade_medicamento: dataValidade,
          quantidade: validQuantidade,
          login_id: entradaData.login_id
        });  
        
        return result;
      }        
      
      /**
       * Registra saída
       */
      async registrarSaida(saidaData) {
        const { estoque_id, armario_id, quantidade } = saidaData;
    
        if (!estoque_id) throw new Error('O campo estoque_id é obrigatório.');
        if (!armario_id) throw new Error('O campo armario_id é obrigatório.');
        if (quantidade === undefined || quantidade === null)
          throw new Error('O campo quantidade é obrigatório.');
    
        const validEstoqueId = Number(estoque_id);
        const validArmarioId = Number(armario_id);
        const validQuantidade = Number(quantidade);
    
        if (isNaN(validArmarioId) || validArmarioId <= 0)
          throw new Error('O armario_id deve ser um número positivo.');
    
        if (isNaN(validQuantidade) || validQuantidade <= 0)
          throw new Error('A quantidade deve ser um número positivo.');
    
        const armarioExiste = await this.estoqueMedicamentoRepository.armarioExiste(validArmarioId);
        if (!armarioExiste) throw new Error('Armário não encontrado.');
    
        const result =  await this.estoqueMedicamentoRepository.registrarSaida({
          estoque_id: validEstoqueId,
          armario_id: validArmarioId,
          quantidade: validQuantidade
        });

        const estoque = await this.estoqueMedicamentoRepository.buscarEstoqueCompleto(validEstoqueId)

        await this.movimentacaoService.registrar({
          tipo: "saida_medicamento",
          medicamento_id: estoque.medicamento_id,
          insumo_id: null,
          casela_id: estoque.casela_id,
          armario_id: validArmarioId,
          validade_medicamento: estoque.validade,
          quantidade: estoque.quantidade,
          login_id: saidaData.login_id
        }); 
        
        return result;
      }
    }
    
    module.exports = EstoqueMedicamentoService;
    