import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { recoveryPassword } from "../services/eventosService"

export default function RecoverPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    newPassword: "",
    newPasswordConfirm: "",
  })

  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) navigate("/register")
  }, [user, navigate])

  // validação simples de senha
  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "A senha deve ter pelo menos 6 caracteres."
    if (!/[0-9]/.test(pwd)) return "A senha deve conter pelo menos 1 número."
    if (!/[a-zA-Z]/.test(pwd)) return "A senha deve conter pelo menos 1 letra."
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")

    if (form.newPassword !== form.newPasswordConfirm) {
      setPasswordError("As senhas não coincidem.")
      return
    }

    const error = validatePassword(form.newPassword)
    if (error) {
      setPasswordError(error)
      return
    }

    setPasswordError("")
    setLoading(true)

    try {
      const ok = await recoveryPassword(form.username, form.newPassword)

      if (ok) {
        setMessage("Senha atualizada com sucesso!")
        setTimeout(() => navigate("/login"), 1500)
      } else {
        setMessage("Erro ao atualizar a senha.")
      }
    } catch (err) {
      console.error(err)
      setMessage("Erro na requisição.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="recover-card">

        <div className="recover-icon">🔒</div>

        <h2 className="recover-title">Recuperar Senha</h2>
        <p className="recover-subtitle">
          Insira seu usuário e escolha uma nova senha.
        </p>

        <form onSubmit={handleSubmit} className="login-form recover-form">
          <input
            placeholder="Usuário"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Nova senha"
            value={form.newPassword}
            onChange={(e) => {
              setForm({ ...form, newPassword: e.target.value })

              const err = validatePassword(e.target.value)
              setPasswordError(err)
            }}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={form.newPasswordConfirm}
            onChange={(e) => {
              setForm({ ...form, newPasswordConfirm: e.target.value })

              const err = validatePassword(e.target.value)
              setPasswordError(err)
            }}
          />

          {passwordError && (
            <p className="password-error">{passwordError}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Atualizar senha"}
          </button>

          {message && <p className="error">{message}</p>}
        </form>

        <p className="recover-link" onClick={() => navigate("/register")}>
          ← Voltar ao Login
        </p>
      </div>
    </div>
  )
}
