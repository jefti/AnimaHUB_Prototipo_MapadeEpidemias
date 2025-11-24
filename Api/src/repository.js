import { query } from './database/db.js'

// --- LOGIN E SESSÕES ---

export async function redefineSenha(localLogin, novaSenha) {
    try {
        const [result] = await query(
            'UPDATE locais SET senha_hash = ? WHERE login = ?;',
            [novaSenha, localLogin]
        )
        return result // contém affectedRows
    } catch (err) {
        console.error('Erro em redefineSenha:', err)
        throw err
    }
}

export async function tryLogin(login, pass) {
    return query(
        'SELECT * FROM locais WHERE login = ? AND senha_hash = ?;',
        [login, pass]
    );
}

export async function getDoencas() {
    return query(
        'SELECT * FROM doencas;',[]
    );
}

export async function createSessao(local_id, token) {
    return query(
        'INSERT INTO sessoes (local_id, token) VALUES (?, ?);',
        [local_id, token]
    );
}

export async function validateSessao(token) {
    return query(
        'SELECT * FROM sessoes WHERE token = ?;',
        [token]
    );
}

// --- EVENTOS ---

export async function createEvento(doenca_id, local_id, latitude, longitude, data_ocorrencia) {
    return query(
        `INSERT INTO eventos (doenca_id, local_id, latitude, longitude, data_ocorrencia)
         VALUES (?, ?, ?, ?, ?);`,
        [doenca_id, local_id, latitude, longitude, data_ocorrencia]
    );
}

// Todos os eventos (sem filtro)
export async function getEventos() {
    return query(`
        SELECT 
			e.id,
            e.latitude as lat,
            e.longitude as lng,
            e.data_ocorrencia as date,
            d.nome AS disease, 
            d.color
        FROM eventos e
        JOIN doencas d ON e.doenca_id = d.id
        JOIN locais l ON e.local_id = l.id
        ORDER BY e.data_ocorrencia DESC;
    `);
}

// Eventos com filtros opcionais
export async function getEventosFiltrados(filtros) {
    let sql = `
        SELECT e.*, d.nome AS doenca, l.nome AS local
        FROM eventos e
        JOIN doencas d ON e.doenca_id = d.id
        JOIN locais l ON e.local_id = l.id
        WHERE 1 = 1
    `;
    const params = [];

    if (filtros.doenca_id) {
        sql += ' AND e.doenca_id = ?';
        params.push(filtros.doenca_id);
    }

    if (filtros.local_id) {
        sql += ' AND e.local_id = ?';
        params.push(filtros.local_id);
    }

    if (filtros.data_inicio) {
        sql += ' AND e.data_ocorrencia >= ?';
        params.push(filtros.data_inicio);
    }

    if (filtros.data_fim) {
        sql += ' AND e.data_ocorrencia <= ?';
        params.push(filtros.data_fim);
    }

    sql += ' ORDER BY e.data_ocorrencia DESC;';

    return query(sql, params);
}

export async function deleteSessao(token) {
    try {
        const [result] = await query(
            'DELETE FROM sessoes WHERE token = ?;',
            [token]
        );
        return result; // contém affectedRows
    } catch (err) {
        console.error('Erro em deleteSessao:', err);
        throw err;
    }
}

// --- Criar zona ---
export async function criarZona({
  nome,
  descricao,
  icone,
  cor,
  data_expiracao,
  lat,
  lng,
  raio_metros,
  local_id
}) {
  const sql = `
    INSERT INTO zonas
      (nome, descricao, icone, cor, data_expiracao, latitude, longitude, raio_metros, local_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  return query(sql, [nome, descricao, icone, cor, data_expiracao, lat, lng, raio_metros, local_id])
}

// --- Listar zonas ---
export async function getZonas() {
  const sql = `SELECT * FROM zonas`
  return query(sql)
}