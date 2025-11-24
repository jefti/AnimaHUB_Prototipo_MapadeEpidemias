import { useState, useRef, useEffect } from "react"

const iconOptions = [
  { name: "warning", label: "Alerta" },
  { name: "medkit", label: "Doença" },
  { name: "information-circle", label: "Info" },
  { name: "star", label: "Favorito" }, // exemplo extra
]

export default function IconSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = iconOptions.find((opt) => opt.name === value)

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        fontFamily: "sans-serif",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px",
          border: "1px solid #9fb89f",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {selectedOption ? (
            <ion-icon name={selectedOption.name} style={{ fontSize: "18px" }} />
          ) : (
            <span style={{ color: "#888" }}>Selecione um ícone</span>
          )}
          <span>{selectedOption?.label}</span>
        </div>
        <span>{open ? "-" : "+"}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "6px",
            background: "#fff",
            //marginTop: "1px",
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {iconOptions.map((opt) => (
            <div
              key={opt.name}
              onClick={() => {
                onChange(opt.name)
                setOpen(false)
              }}
              style={{
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              <ion-icon name={opt.name} style={{ fontSize: "18px" }} />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}