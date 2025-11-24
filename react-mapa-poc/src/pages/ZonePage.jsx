import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useMapState } from "../contexts/MapContext"
import { MapContainer, TileLayer, useMapEvents, Circle, Tooltip } from "react-leaflet"
import { criarZona } from "../services/eventosService"
import LoginForm from "../components/LoginForm"
import IconSelect from "../components/IconSelect"
import "leaflet/dist/leaflet.css"

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function ZonePage() {
  const { user, logout } = useAuth()
  const { fetchZones } = useMapState()

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    icone: "",
    cor: "#FF0000",
    data_expiracao: "",
    lat: "",
    lng: "",
    raio_metros: 100
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const iconOptions = [
    { name: "Alerta", value: "warning-outline", emoji: "⚠️" },
    { name: "Doença", value: "medkit-outline", emoji: "🧪" },
    { name: "Info", value: "information-circle-outline", emoji: "ℹ️" },
    { name: "Segurança", value: "shield-checkmark-outline", emoji: "🛡️" },
    { name: "Laboratório", value: "flask-outline", emoji: "🧫" },
    { name: "star-outline", label: "Favorito" },
  ]

  const handleAddZone = async (e) => {
    e.preventDefault()
    setMessage("")

    if (!form.nome || !form.lat || !form.lng || !form.raio_metros) {
      setMessage("⚠️ Preencha todos os campos obrigatórios.")
      return
    }

    try {
      setLoading(true)
      await criarZona(form)
      setMessage("✅ Zona registrada com sucesso!")
      setForm({
        nome: "",
        descricao: "",
        icone: "",
        cor: "#FF0000",
        data_expiracao: "",
        lat: "",
        lng: "",
        raio_metros: 100
      })
      fetchZones()
    } catch (err) {
      console.error("Erro ao registrar zona:", err)
      setMessage("❌ Falha ao registrar a zona.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <LoginForm />

  return (
    <div className="register-wrapper">
      <div className="register-card">

        <div className="header">
          <h2 className="register-title">Delimitar Zona de Atenção</h2>
          <button onClick={logout}>Sair</button>
        </div>

        <div className="register-grid">

          {/* FORMULÁRIO */}
          <form onSubmit={handleAddZone} className="register-form">

            <input
              placeholder="Nome de referência"
              value={form.nome}
              maxLength={50}
              onChange={e => setForm({ ...form, nome: e.target.value })}
            />

            <input
              placeholder="Descrição / Informação"
              value={form.descricao}
              maxLength={100}
              onChange={e => setForm({ ...form, descricao: e.target.value })}
            />

            <input
              type="number"
              placeholder="Raio em metros"
              value={form.raio_metros}
              min={1}
              onChange={e => setForm({ ...form, raio_metros: parseInt((e.target.value > 0) ? e.target.value : 1) })}
            />

            <input
              type="date"
              placeholder="Data de fim"
              value={form.data_expiracao}
              onChange={e => setForm({ ...form, data_expiracao: e.target.value })}
            />

            <select
            value={form.cor}
            onChange={e => setForm({ ...form, cor: e.target.value })}
            >
                <option value="#e63946">🔴 Vermelho</option>
                <option value="#2a9d8f">🟢 Verde</option>
                <option value="#f4a261">🟡 Amarelo</option>
                <option value="#457b9d">🔵 Azul</option>
                <option value="#1d1d1d">⚫ Preto</option>
            </select>

            <IconSelect
              value={form.icone}
              onChange={(val) => setForm({ ...form, icone: val })}
            />

            <div className="register-coords">
              <input placeholder="Latitude" value={form.lat} readOnly />
              <input placeholder="Longitude" value={form.lng} readOnly />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Adicionar zona"}
            </button>

            {message && (
              <p className={`register-message ${message.includes("❌") ? "error" : ""}`}>
                {message}
              </p>
            )}
          </form>

          {/* MAPA */}
          <div className="register-map-wrapper">
            <MapContainer
              center={[-5.7945, -35.211]}
              zoom={12}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <LocationPicker onSelect={({ lat, lng }) => setForm({ ...form, lat, lng })} />

              {form.lat && form.lng && (
                <Circle
                  center={[form.lat, form.lng]}
                  radius={form.raio_metros}
                  pathOptions={{ color: form.cor, fillColor: form.cor, fillOpacity: 0.3 }}
                >
                  <Tooltip>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {form.icone && <ion-icon name={form.icone}></ion-icon>}
                      <span>{form.nome || "Nova Zona"}</span>
                    </div>
                  </Tooltip>
                </Circle>
              )}
            </MapContainer>
            <p className="register-coords-title">Clique no mapa para definir a latitude e longitude</p>
          </div>

        </div>
      </div>
    </div>
  )
}
