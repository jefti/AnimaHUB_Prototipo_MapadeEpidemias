import React, { createContext, useContext, useState, useEffect } from "react"
import { listarEventos, listarZonas } from "../services/eventosService"

const MapContext = createContext(null)

export function MapProvider({ children }) {
  const [markers, setMarkers] = useState([])
  const [zones, setZones] = useState([])
  const [selectedDisease, setSelectedDisease] = useState("Todos")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showZones, setShowZones] = useState(true)

  // --- EVENTOS ---
  const fetchMarkers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listarEventos()

      const validMarkers = (Array.isArray(data) ? data : [])
        .map((e) => {
          const lat = parseFloat(e.lat ?? e.latitude ?? e.latitude_string)
          const lng = parseFloat(e.lng ?? e.longitude ?? e.longitude_string)
          if (isNaN(lat) || isNaN(lng)) return null

          return {
            id: e.id,
            lat,
            lng,
            disease: e.disease || e.doenca || "Desconhecida",
            color: (e.color || e.color_hex || "#808080").toString().trim(),
            date: typeof e.date === "string" && e.date.includes("T")
              ? e.date.split("T")[0]
              : (e.date ?? ""),
          }
        })
        .filter(Boolean)

      setMarkers(validMarkers)
    } catch (err) {
      console.error("Erro ao buscar eventos:", err)
      setError("Não foi possível carregar os eventos.")
    } finally {
      setLoading(false)
    }
  }

  // --- ZONAS ---
  const fetchZones = async () => {
    try {
      const data = await listarZonas()
      const validZones = (Array.isArray(data) ? data : []).map((z) => ({
        id: z.id,
        lat: parseFloat(z.latitude),
        lng: parseFloat(z.longitude),
        raio: parseFloat(z.raio_metros),
        nome: z.nome,
        descricao: z.descricao,
        icone: z.icone,
        cor: z.cor,
        data_expiracao: z.data_expiracao
      }))

      setZones(validZones)
    } catch (err) {
      console.error("Erro ao buscar zonas:", err)
    }
  }

  // Carrega os eventos e zonas na inicialização
  useEffect(() => {
    let mounted = true
    fetchMarkers()
    fetchZones()
    return () => { mounted = false }
  }, [])

  const addMarker = (marker) => {
    const lat = parseFloat(marker.lat)
    const lng = parseFloat(marker.lng)
    if (isNaN(lat) || isNaN(lng)) return
    setMarkers((m) => [
      ...m,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...marker,
        lat,
        lng,
      },
    ])
  }

  const value = {
    markers,
    setMarkers,
    addMarker,
    fetchMarkers,
    zones,      
    fetchZones,
    selectedDisease,
    setSelectedDisease,
    loading,
    error,
    showZones,
    setShowZones,
    fetchZones,
  }

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export function useMapState() {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error("useMapState deve ser usado dentro de MapProvider")
  return ctx
}
