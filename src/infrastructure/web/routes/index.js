const express = require('express');
const router = express.Router();

const MedicamentoController = require('../controllers/medicamento');
const MedicamentoService = require('../../../core/application/services/medicamento');
const PostgresMedicamentoRepository = require('../../database/repositories/PostgresMedicamentoRepository');

const InsumoController = require('../controllers/insumo');
const InsumoService = require('../../../core/application/services/insumo');
const PostgresInsumoRepository = require('../../database/repositories/PostgresInsumoRepository');

const ArmarioController = require('../controllers/armario');
const ArmarioService = require('../../../core/application/services/armario');
const PostgresArmarioRepository = require('../../database/repositories/PostgresArmarioRepository');

const ResidenteController = require('../controllers/residente');
const ResidenteService = require('../../../core/application/services/residente');
const PostgresResidenteRepository = require('../../database/repositories/PostgresResidenteRepository');

const medicamentoRepository = new PostgresMedicamentoRepository();
const medicamentoService = new MedicamentoService(medicamentoRepository);
const medicamentoController = new MedicamentoController(medicamentoService);

const insumoRepository = new PostgresInsumoRepository();
const insumoService = new InsumoService(insumoRepository);
const insumoController = new InsumoController(insumoService);

const armarioRepository = new PostgresArmarioRepository();
const armarioService = new ArmarioService(armarioRepository);
const armarioController = new ArmarioController(armarioService);

const residenteRepository = new PostgresResidenteRepository();
const residenteService = new ResidenteService(residenteRepository);
const residenteController = new ResidenteController(residenteService);

// Define a rota POST para cadastrar um medicamento
router.post('/medicamentos', (req, res) => medicamentoController.create(req, res));

// Define a rota POST para cadastrar um armário
router.post('/armarios', (req, res) => armarioController.create(req, res));

// Define a rota POST para cadastrar um insumo
router.post('/insumos', (req, res) => insumoController.create(req, res));

// Rotas para residentes
router.get('/residentes', (req, res) => residenteController.findAll(req, res));
router.get('/residentes/:casela', (req, res) => residenteController.findByCasela(req, res));
router.post('/residentes', (req, res) => residenteController.create(req, res));
router.put('/residentes/:casela', (req, res) => residenteController.update(req, res));
router.delete('/residentes/:casela', (req, res) => residenteController.delete(req, res));

module.exports = router;