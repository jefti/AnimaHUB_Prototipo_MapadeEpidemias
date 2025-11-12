import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMapState } from "../contexts/MapContext"
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet"
import { criarEvento, getDeseases } from "../services/eventosService"
import "leaflet/dist/leaflet.css"
import "./RegisterPage.css"

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function RegisterPage() {
  const { user, login, logout } = useAuth()
  const { fetchMarkers  } = useMapState()

  const [form, setForm] = useState({ lat: "", lng: "", disease: "", date: "" })
  const [message, setMessage] = useState("")
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [diseases, setDiseases] = useState([]) // lista de doenças do backend

  // --- Carregar doenças do backend ---
  useEffect(() => {
    async function fetchDiseases() {
      try {
        const data = await getDeseases()
        setDiseases(data) // data deve ter [{id, nome, color}]
      } catch (err) {
        console.error("Erro ao carregar doenças:", err)
      }
    }
    fetchDiseases()
  }, [])

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)
    try {
      const ok = await login(loginForm.username, loginForm.password)
      if (!ok) setMessage("Usuário ou senha incorretos")
    } catch (err) {
      console.error(err)
      setMessage("Erro ao tentar logar")
    } finally {
      setLoading(false)
    }
  }

  // --- REGISTRAR EVENTO ---
  const handleAddMarker = async (e) => {
    e.preventDefault()
    setMessage("")

    if (!form.lat || !form.lng || !form.disease || !form.date) {
      setMessage("⚠️ Preencha todos os campos antes de registrar.")
      return
    }

    const diseaseInfo = diseases.find(d => d.nome === form.disease)
    if (!diseaseInfo) {
      setMessage("⚠️ Doença inválida")
      return
    }

    try {
      setLoading(true)

      const payload = {
        doenca_id: diseaseInfo.id,
        latitude: parseFloat(form.lat),
        longitude: parseFloat(form.lng),
        data_ocorrencia: form.date,
      }

      const result = await criarEvento(payload)
      setMessage("✅ Evento registrado com sucesso!")
      setForm({ lat: "", lng: "", disease: "", date: "" })
      fetchMarkers()
    } catch (err) {
      console.error("Erro ao registrar evento:", err)
      setMessage("❌ Falha ao registrar o evento.")
    } finally {
      setLoading(false)
    }
  }

  // --- LOGIN FORM ---
  if (!user) {
    return (
      <div className="page">
        <h2>Login necessário</h2>
        <form onSubmit={handleLogin} className="form">
          <input
            placeholder="Usuário"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {message && <p className="error">{message}</p>}
        </form>
      </div>
    )
  }

  // --- LISTA DE DOENÇAS (únicas e disponíveis no backend) ---
  const diseaseNames = diseases.map(d => d.nome)

  return (
    <div className="page">
      <div className="header">
        <h2>Registrar novo ponto</h2>
        <button onClick={logout}>Sair</button>
      </div>

      <form onSubmit={handleAddMarker} className="form">
        <select
          value={form.disease}
          onChange={(e) => setForm({ ...form, disease: e.target.value })}
        >
          <option value="">Selecione uma doença</option>
          {diseaseNames.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <div className="map-section">
          <p>Clique no mapa para definir a latitude e longitude</p>
          <MapContainer center={[-5.7945, -35.211]} zoom={12} style={{ height: "300px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker
              onSelect={({ lat, lng }) => setForm({ ...form, lat, lng })}
            />
            {form.lat && form.lng && (
              <Marker position={[form.lat, form.lng]}>
                <Popup>Local selecionado</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="coords">
          <input placeholder="Latitude" value={form.lat} readOnly />
          <input placeholder="Longitude" value={form.lng} readOnly />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Adicionar ponto"}
        </button>
      </form>

      {message && <p className="info">{message}</p>}
    </div>
  )
}
