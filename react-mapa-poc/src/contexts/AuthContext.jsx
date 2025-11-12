import React, { createContext, useContext, useState, useEffect } from "react"
import { login as apiLogin, logout as apiLogout } from "../services/eventosService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // --- Inicializa a partir do localStorage ---
  useEffect(() => {
    const token = localStorage.getItem("token")
    const usuario = localStorage.getItem("usuario")
    if (token && usuario) {
      setUser({ username: usuario })
    }
    setLoading(false)
  }, [])

  // --- LOGIN ---
  const login = async (username, password) => {
    try {
      const res = await apiLogin(username, password)
      if (res?.token && res?.usuario) {
        setUser({ username: res.usuario })
        localStorage.setItem("token", res.token)
        localStorage.setItem("usuario", res.usuario)
        return true
      }
      return false
    } catch (err) {
      console.error("Erro no login:", err)
      return false
    }
  }

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await apiLogout()
    } catch (err) {
      console.error("Erro no logout:", err)
    } finally {
      setUser(null)
      localStorage.removeItem("token")
      localStorage.removeItem("usuario")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}
