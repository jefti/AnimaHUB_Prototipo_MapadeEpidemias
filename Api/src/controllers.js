import * as eventosRepository from "../src/repository.js";
import crypto from 'crypto';

// --- LOGIN ---
export async function login(req, res) {
    try {
        const { login, senha } = req.body;
        const [result] = await eventosRepository.tryLogin(login, senha);

        if (result.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        const local = result[0];

        // Gera um token aleatório
        const token = crypto.randomBytes(32).toString('hex');
        await eventosRepository.createSessao(local.id, token);

        return res.status(200).json({ token, usuario: local.nome });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao efetuar login' });
    }
}

// --- VALIDAR TOKEN ---
export async function validarToken(req, res, next) {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const [sessao] = await eventosRepository.validateSessao(token);
        if (sessao.length === 0) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }

        // Armazena o ID do usuário no request (para usar em outras rotas)
        req.local_id = sessao[0].local_id;

        next(); // passa para a próxima função (middleware/controller)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao validar token' });
    }
}

// --- CRIAR EVENTO ---
export async function criarEvento(req, res) {
    try {
        const { doenca_id, latitude, longitude, data_ocorrencia } = req.body;
        const local_id = req.local_id; // vem do middleware de validação do token

        if (!doenca_id || !latitude || !longitude) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        await eventosRepository.createEvento(
            doenca_id,
            local_id,
            latitude,
            longitude,
            data_ocorrencia || new Date()
        );

        return res.status(201).json({ message: 'Evento registrado com sucesso!' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao criar evento' });
    }
}

// --- LISTAR EVENTOS (com ou sem filtro) ---
export async function listarEventos(req, res) {
    try {
        const filtros = {
            doenca_id: req.query.doenca_id,
            local_id: req.query.local_id,
            data_inicio: req.query.data_inicio,
            data_fim: req.query.data_fim
        };

        let eventos;
        if (
            filtros.doenca_id ||
            filtros.local_id ||
            filtros.data_inicio ||
            filtros.data_fim
        ) {
            [eventos] = await eventosRepository.getEventosFiltrados(filtros);
        } else {
            [eventos] = await eventosRepository.getEventos();
        }

        return res.status(200).json(eventos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao listar eventos' });
    }
}

export async function logout(req, res) {
  try {
      const token = req.headers['authorization'];

      if (!token) {
          return res.status(400).json({ error: 'Token não fornecido' });
      }

      const result = await eventosRepository.deleteSessao(token);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Sessão não encontrada' });
      }

      return res.status(200).json({ message: 'Logout realizado com sucesso!' });
  } catch (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
  }
}

export async function getDiseases(req, res) {
    try {
        const [result] = await eventosRepository.getDoencas()
        return res.status(200).json(result);
  } catch (err) {
      console.error('Erro na recuperação de doenças:', err);
      return res.status(500).json({ error: 'Erro ao recuperar doenças' });
  }
}