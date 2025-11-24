import api from "./api"
import { hashSenha } from "./crypto.js"

// --- LOGIN ---
export async function login(login, senha) {
  const senhaHash = await hashSenha(senha)
  const body = { login, senha: senhaHash }
  const response = await api.post("/login", body)

  // salva token localmente
  localStorage.setItem("token", response.data.token)
  localStorage.setItem("usuario", response.data.usuario)

  return response.data
}

// --- RECUPERAR SENHA ---
export async function recoveryPassword(login, nova_senha) {
  const senhaHash = await hashSenha(nova_senha)
  const body = { login, nova_senha: senhaHash }
  const response = await api.post("/recovery", body)
  return response.data
}

// --- LOGOUT ---
export async function logout() {
  const response = await api.post("/logout")
  localStorage.removeItem("token")
  localStorage.removeItem("usuario")
  return response.data
}

// --- CRIAR EVENTO ---
export async function criarEvento({ doenca_id, latitude, longitude, data_ocorrencia }) {
  const body = { doenca_id, latitude, longitude, data_ocorrencia }
  const response = await api.post("/eventos", body)
  return response.data
}

// --- LISTAR EVENTOS (com ou sem filtro) ---
export async function listarEventos(filtros = {}) {
  const params = new URLSearchParams(filtros).toString()
  const url = params ? `/eventos?${params}` : "/eventos"
  const response = await api.get(url)
  return response.data
}

// --- LISTAR DOENÇAS ---
export async function getDeseases() {
  const response = await api.get("/doencas")
  return response.data
}

// --- CRIAR ZONA ---
export async function criarZona({
  nome,
  descricao,
  icone,
  cor,
  data_expiracao,
  lat,
  lng,
  raio_metros
}) {
  const body = { nome, descricao, icone, cor, data_expiracao, lat, lng, raio_metros }
  
  const token = localStorage.getItem("token")
  const response = await api.post("/zonas", body, {
    headers: { Authorization: token }
  })

  return response.data
}

// --- LISTAR ZONAS ---
export async function listarZonas() {
  const response = await api.get("/zonas")
  return response.data
}