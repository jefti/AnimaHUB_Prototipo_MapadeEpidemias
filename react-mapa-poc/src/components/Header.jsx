import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Mapa</Link>
        <Link to="/register" style={styles.link}>Registro</Link>
      </nav>
    </header>
  )
}

const styles = {
  header: {
    backgroundColor: "#282c34",
    padding: "10px 30px",
    color: "white",
    position: "relative",
    zIndex: 1000,
    gap: "20px",
    height: "4vh",
    display: "flex",
    alignItems: "center",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
}