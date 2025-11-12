import api from "./api"

// --- LOGIN ---
export async function login(login, senha) {
  const body = { login, senha }
  const response = await api.post("/login", body)

  // salva token localmente
  localStorage.setItem("token", response.data.token)
  localStorage.setItem("usuario", response.data.usuario)

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

export async function listarEventos(filtros = {}) {
  const params = new URLSearchParams(filtros).toString()
  const url = params ? `/eventos?${params}` : "/eventos"
  const response = await api.get(url)
  return response.data
}


export async function getDeseases() {
  const response = await api.get("/doencas")
  return response.data
}