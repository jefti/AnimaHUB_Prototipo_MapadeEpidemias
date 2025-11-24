import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function LoginForm() {
  const { login } = useAuth()

  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    setLoading(true)
    try {
      const ok = await login(loginForm.username, loginForm.password)
      if (!ok) setMessage("Usuário ou senha incorretos")
    } catch (err) {
      console.error(err)
      setMessage("Erro ao tentar logar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Acesso ao Sistema</h2>
        <p className="login-subtitle">Faça login para continuar</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            placeholder="Usuário"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Senha"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <a href="/recover" className="recover-link">
            Esqueci minha senha
          </a>

          {message && <p className="error">{message}</p>}
        </form>
      </div>
    </div>
  )
}
