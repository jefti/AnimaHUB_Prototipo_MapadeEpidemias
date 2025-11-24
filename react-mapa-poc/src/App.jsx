import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { MapProvider } from "./contexts/MapContext"
import Header from "./components/Header"
import MapPage from "./pages/MapPage"
import RegisterPage from "./pages/RegisterPage"
import RecoverPage from "./pages/RecoverPage"
import ZonePage from "./pages/zonePage"

export default function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <BrowserRouter>
          <Header /> 
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recover" element={<RecoverPage />} />
            <Route path="/zone" element={<ZonePage />} />
          </Routes>
        </BrowserRouter>
      </MapProvider>
    </AuthProvider>
  )
}