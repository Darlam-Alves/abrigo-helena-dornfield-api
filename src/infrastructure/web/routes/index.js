const express = require('express');
const router = express.Router();

const MedicamentoController = require('../controllers/medicamento');
const MedicamentoService = require('../../../core/application/services/medicamento');
const PostgresMedicamentoRepository = require('../../database/repositories/PostgresMedicamentoRepository');

const medicamentoRepository = new PostgresMedicamentoRepository();
const medicamentoService = new MedicamentoService(medicamentoRepository);
const medicamentoController = new MedicamentoController(medicamentoService);

// Define a rota POST para cadastrar um medicamento
router.post('/medicamentos', (req, res) => medicamentoController.create(req, res));

module.exports = router;