import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000", // ajuste conforme o endereço do seu backend
  headers: {
    "Content-Type": "application/json"
  }
})

// Interceptador para adicionar token automaticamente, se existir
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers["Authorization"] = token
  }
  return config
})

export default api
