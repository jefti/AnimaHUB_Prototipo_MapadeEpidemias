import { useState } from "react"
import { Link } from "react-router-dom"

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>

        <div 
          style={styles.logoContainer} 
          onClick={() => setOpen(!open)}
        >
          <ion-icon name="map" style={styles.icon}></ion-icon>
          <span style={styles.logoText} className="logo-text">
            Mapa Epidemiológico
          </span>
        </div>

        <div style={styles.links}>
          {/* <Link to="/register" style={styles.link}>Registro</Link> */}
        </div>
      </nav>

      {open && (
        <div style={styles.dropdown}>
          <Link to="/" style={styles.dropdownItem} onClick={() => setOpen(false)}>
            <ion-icon name="home-outline" style={styles.dropdownIcon}></ion-icon>
              Página Inicial
          </Link>

          <Link to="/register" style={styles.dropdownItem} onClick={() => setOpen(false)}>
            <ion-icon name="add-circle-outline" style={styles.dropdownIcon}></ion-icon>
              Marcar Ponto
          </Link>

          <Link to="/zone" style={styles.dropdownItem} onClick={() => setOpen(false)}>
            <ion-icon name="shield-checkmark-outline" style={styles.dropdownIcon}></ion-icon>
              Delimitar Zona
          </Link>
        </div>
      )}
    </header>
  )
}

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#282c34",
    padding: "12px 30px",
    color: "white",
    zIndex: 9999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative"
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    userSelect: "none"
  },

  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  icon: {
    fontSize: "26px",
  },

  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    fontSize: "18px",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },

  dropdown: {
    position: "absolute",
    top: "52px",
    left: "15px",
    backgroundColor: "#333",
    padding: "10px 0",
    borderRadius: "8px",
    width: "200px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    zIndex: 10000
  },
  dropdownItem: {
    padding: "12px 20px",
    fontSize: "16px",
    color: "white",
    textDecoration: "none",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  dropdownIcon: {
    fontSize: "20px"
  }
}
