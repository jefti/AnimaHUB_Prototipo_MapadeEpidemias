import { useState } from "react"

export default function FiltersMenu({ 
  diseases, 
  selectedDisease, 
  setSelectedDisease, 
  showZones, 
  setShowZones,
  pointSize,
  setPointSize
}) {
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <div className={`filters-menu ${menuOpen ? "open" : "closed"}`}>
      <div className="filters-menu-header" onClick={() => setMenuOpen(!menuOpen)}>
        <strong className="filters-menu-title">
          <ion-icon name="filter" class="filters-menu-icon"></ion-icon>
          Filtros
        </strong>
        <div className="filters-menu-toggle">{menuOpen ? "−" : "+"}</div>
      </div>

      {menuOpen && (
        <div className="filters-menu-content">
          
          {/* Linha Doença */}
          <div className="filter-row">
            <label>Doença:</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
            >
              {diseases.map((disease) => (
                <option key={disease} value={disease}>
                  {disease}
                </option>
              ))}
            </select>
          </div>

          {/* Controle de tamanho dos pontos */}
          <div className="filter-row">
            <label>Tamanho dos Pontos:</label>
            <input
              type="number"
              value={pointSize}
              onChange={(e) => setPointSize(parseInt(e.target.value))}
              min={1}
              max={50}
            />
          </div>

          {/* Checkbox de Zonas */}
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={showZones}
              onChange={(e) => setShowZones(e.target.checked)}
            />
            Exibir Zonas
          </label>


        </div>
      )}
    </div>
  )
}
