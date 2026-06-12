import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [isAuthenticated, setIsAuth]  = useState(false)

  // Bootstrap — load user from stored token
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('mediai_token')
      if (!token) { setLoading(false); return }
      try {
        const res = await authService.getMe()
        setUser(res.data)
        setIsAuth(true)
      } catch {
        localStorage.removeItem('mediai_token')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials)
    const { user: u, token } = res.data
    localStorage.setItem('mediai_token', token.access_token)
    setUser(u)
    setIsAuth(true)
    toast.success(`Welcome back, ${u.name}! 👋`)
    return u
  }, [])

  const loginWithOtp = useCallback(async ({ mobile, otp }) => {
    const res = await authService.verifyOtp({ mobile, otp })
    const { user: u, token } = res.data
    localStorage.setItem('mediai_token', token.access_token)
    setUser(u)
    setIsAuth(true)
    toast.success(`Welcome, ${u.name}! 👋`)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { user: u, token } = res.data
    localStorage.setItem('mediai_token', token.access_token)
    setUser(u)
    setIsAuth(true)
    toast.success('Account created! Welcome to MediAI 🎉')
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mediai_token')
    setUser(null)
    setIsAuth(false)
    toast.success('Signed out successfully')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, loginWithOtp, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
