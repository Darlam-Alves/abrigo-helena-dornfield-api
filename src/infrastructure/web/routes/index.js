const express = require('express');
const router = express.Router();

const MedicamentoController = require('../controllers/medicamento');
const MedicamentoService = require('../../../core/application/services/medicamento');
const PostgresMedicamentoRepository = require('../../database/repositories/PostgresMedicamentoRepository');

const ArmarioController = require('../controllers/armario');
const ArmarioService = require('../../../core/application/services/armario');
const PostgresArmarioRepository = require('../../database/repositories/PostgresArmarioRepository');

const medicamentoRepository = new PostgresMedicamentoRepository();
const medicamentoService = new MedicamentoService(medicamentoRepository);
const medicamentoController = new MedicamentoController(medicamentoService);

const armarioRepository = new PostgresArmarioRepository();
const armarioService = new ArmarioService(armarioRepository);
const armarioController = new ArmarioController(armarioService);

// Define a rota POST para cadastrar um medicamento
router.post('/medicamentos', (req, res) => medicamentoController.create(req, res));

// Define a rota POST para cadastrar um armário
router.post('/armarios', (req, res) => armarioController.create(req, res));

module.exports = router;