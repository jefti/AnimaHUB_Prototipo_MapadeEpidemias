import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMapState } from "../contexts/MapContext"
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet"
import { criarEvento, getDeseases } from "../services/eventosService"
import LoginForm from "../components/LoginForm"
import "leaflet/dist/leaflet.css"

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function RegisterPage() {
  const { user, logout } = useAuth()
  const { fetchMarkers  } = useMapState()

  const [form, setForm] = useState({ lat: "", lng: "", disease: "", date: "" })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [diseases, setDiseases] = useState([]) 

  useEffect(() => {
    async function fetchDiseases() {
      try {
        const data = await getDeseases()
        setDiseases(data)
      } catch (err) {
        console.error("Erro ao carregar doenças:", err)
      }
    }
    fetchDiseases()
  }, [])

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

  if (!user) return <LoginForm />


  const diseaseNames = diseases.map(d => d.nome)

return (
  <div className="register-wrapper">
    <div className="register-card">

      <div className="header">
        <h2 className="register-title">Marcar Ponto de Ocorrência</h2>
        <button onClick={logout}>Sair</button>
      </div>

      <div className="register-grid">

        {/* COLUNA ESQUERDA — FORM */}
        <form onSubmit={handleAddMarker} className="register-form">

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

          <div className="register-coords">
            <input placeholder="Latitude" value={form.lat} readOnly />
            <input placeholder="Longitude" value={form.lng} readOnly />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Adicionar ponto"}
          </button>
          {message && (
            <p className={`register-message ${message.includes("❌") ? "error" : ""}`}>
              {message}
            </p>
          )}
        </form>

        {/* COLUNA DIREITA — MAPA */}
        <div className="register-map-wrapper">

          <MapContainer
            center={[-5.7945, -35.211]}
            zoom={12}
            style={{ height: "300px", width: "100%" }}
          >
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
          <p className="register-coords-title" >Clique no mapa para definir a latitude e longitude</p>
        </div>

      </div>



    </div>
  </div>
)

}
