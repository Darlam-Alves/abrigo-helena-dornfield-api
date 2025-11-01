const Residente = require('../../domain/residente');

class ResidenteService {
  constructor(residenteRepository) {
    this.residenteRepository = residenteRepository;
  }

  async findAll() {
    return await this.residenteRepository.findAll();
  }

  async findByCasela(casela) {
    const residente = await this.residenteRepository.findByCasela(casela);
    if (!residente) {
      throw new Error('Residente não encontrado');
    }
    return residente;
  }

  async create(residenteData) {
    try {
      const residente = new Residente(residenteData.casela, residenteData.name);
      residente.validate();
     
      // Verificar se já existe um residente com a mesma casela
      const existingResidente = await this.residenteRepository.findByCasela(residente.numCasela);
      if (existingResidente) {
        throw new Error(`Já existe um residente com a casela ${residente.numCasela}`);
      }
     
      return await this.residenteRepository.create(residente);
    } catch (error) {
      throw error;
    }
  }

  async update(residenteData) {
    try {
      const residente = new Residente(residenteData.casela, residenteData.name);
      residente.validate();
     
      // Verificar se o residente existe
      await this.findByCasela(residente.numCasela);
     
      return await this.residenteRepository.update(residente);
    } catch (error) {
      throw error;
    }
  }

  async delete(casela) {
    try {
      // Verificar se o residente existe
      await this.findByCasela(casela);
     
      return await this.residenteRepository.delete(casela);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ResidenteService;