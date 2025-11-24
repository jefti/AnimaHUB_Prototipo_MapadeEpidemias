import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useMapState } from "../contexts/MapContext"
import { getDeseases } from "../services/eventosService"
import FiltersMenu from "../components/FiltersMenu"

export default function MapPage() {
  const { markers, zones, selectedDisease, setSelectedDisease, showZones, setShowZones, } = useMapState()
  const [diseases, setDiseases] = useState(["Todos"])
  const [pointSize, setpointSize] = useState(16)

  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16)
    let G = parseInt(color.substring(3, 5), 16)
    let B = parseInt(color.substring(5, 7), 16) 
    R = parseInt((R * (100 + percent)) / 100)
    G = parseInt((G * (100 + percent)) / 100)
    B = parseInt((B * (100 + percent)) / 100) 
    R = R < 255 ? R : 255
    G = G < 255 ? G : 255
    B = B < 255 ? B : 255   
    const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16)
    const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16)
    const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16) 
    return "#" + RR + GG + BB
  }

  const createMaker = (color) =>
    L.divIcon({
      className: "custom-icon",
      html: `<div style="
        background:${color};
        width:${pointSize}px;
        height:${pointSize}px;
        border-radius:50%;
        border:1px solid ${shadeColor(color, -20)};
      "></div>`,
    })


  useEffect(() => {
    async function fetchDiseases() {
      try {
        const data = await getDeseases()
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
    <div style={{ width: "100%", height: "94vh", position: "relative", marginTop: "40px" }}>

      <FiltersMenu
        diseases={diseases}
        selectedDisease={selectedDisease}
        setSelectedDisease={setSelectedDisease}
        showZones={showZones}
        setShowZones={setShowZones}
        pointSize={pointSize}
        setPointSize={setpointSize}
      />




      {/* Mapa */}
      <MapContainer
        center={[-5.79448, -35.211]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Eventos */}
        {filteredMarkers.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={createMaker(p.color)}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <strong>{p.disease}</strong>
                <br />
                <small>{p.date}</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Zonas */}
{/* Zonas */}
{showZones && zones.map((z) => (
  <Circle
    key={z.id}
    center={[z.lat, z.lng]}
    radius={z.raio ?? 1}
    pathOptions={{
      color: z.cor,      
      fillColor: z.cor,  
      fillOpacity: 0.3,  
    }}
  >
    <Popup>
      <div className="zone-popup">
        <div className="zone-popup-header">
          {z.icone && (
            <ion-icon
              name={z.icone}
              class="zone-popup-header-icon"
              style={{ color: z.cor || "#333" }}
            />
          )}
          <div className="zone-popup-header-title" style={{ color: z.cor || "#333" }}>
            {z.nome}
          </div>
        </div>
        {z.descricao && <div className="zone-popup-description">{z.descricao}</div>}
        {z.data_expiracao && (
          <div className="zone-popup-expiration">
            Válido até: {new Date(z.data_expiracao).toLocaleDateString()}
          </div>
        )}
      </div>
    </Popup>
  </Circle>
))}


      </MapContainer>
    </div>
  )
}
