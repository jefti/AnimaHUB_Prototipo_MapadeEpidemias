import { Router } from 'express';
import * as eventosController from '../src/controllers.js';

const router = Router();

// --- LOGIN ---
router.post('/login', eventosController.login);

// --- LOGOUT ---
router.post('/logout', eventosController.validarToken, eventosController.logout);

// --- RECUPERAR SENHA ---
router.post('/recovery', eventosController.recoveryPassword);

// --- REGISTRAR PONTO / CRIAR EVENTO ---
router.post('/eventos', eventosController.validarToken, eventosController.criarEvento);

// --- LISTAR EVENTOS (com ou sem filtro) ---
router.get('/eventos', eventosController.listarEventos);

// --- LISTAR DOENÇAS ---
router.get('/doencas', eventosController.getDiseases);

// --- Criar ZONAS ---
router.post('/zonas', eventosController.validarToken, eventosController.criarZonaController)

//--- LISTAR ZONAS ---
router.get('/zonas', eventosController.listarZonasController)

export default router;
