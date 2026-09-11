import { createContext, useContext, useState } from 'react'
import { api, getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getToken()))

  async function login(email, password) {
    const { token, user } = await api.login(email, password)
    setToken(token)
    setUser(user)
    setIsAuthenticated(true)
  }

  function logout() {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
