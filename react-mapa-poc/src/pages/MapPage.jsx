import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useMapState } from "../contexts/MapContext"
import { getDeseases } from "../services/eventosService"

export default function MapPage() {
  const { markers, selectedDisease, setSelectedDisease } = useMapState()
  const [diseases, setDiseases] = useState(["Todos"])

  const createIcon = (color) =>
    L.divIcon({
      className: "custom-icon",
      html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid black"></div>`,
    })

  useEffect(() => {
    async function fetchDiseases() {
      try {
        const data = await getDeseases() // chama a API /doencas
        const diseaseNames = data.map(d => d.nome)
        setDiseases(["Todos", ...diseaseNames])
      } catch (err) {
        console.error("Erro ao buscar doenças:", err)
      }
    }
    fetchDiseases()
  }, [])

  const filteredMarkers =
    selectedDisease && selectedDisease !== "Todos"
      ? markers.filter((m) => m.disease === selectedDisease)
      : markers

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      {/* seletor de doença */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          right: 50,
          background: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 1000,
        }}
      >
        <label style={{ marginRight: 8, fontWeight: "bold" }}>Doença:</label>
        <select
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          style={{
            padding: "4px 6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {diseases.map((disease) => (
            <option key={disease} value={disease}>
              {disease}
            </option>
          ))}
        </select>
      </div>

      {/* mapa */}
      <MapContainer
        center={[-5.79448, -35.211]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {filteredMarkers.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={createIcon(p.color)}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <strong>{p.disease}</strong>
                <br />
                <small>{p.date}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
