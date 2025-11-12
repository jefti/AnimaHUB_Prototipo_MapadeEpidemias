import { Router } from 'express';
import * as eventosController from '../src/controllers.js';

const router = Router();

// --- LOGIN ---
router.post('/login', eventosController.login);

// --- LOGOUT ---
router.post('/logout', eventosController.validarToken, eventosController.logout);

// --- REGISTRAR PONTO / CRIAR EVENTO ---
router.post('/eventos', eventosController.validarToken, eventosController.criarEvento);

// --- LISTAR EVENTOS (com ou sem filtro) ---
router.get('/eventos', eventosController.listarEventos);

router.get('/doencas', eventosController.getDiseases);

export default router;
