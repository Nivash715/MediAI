import { useEffect } from 'react'
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('mediai_theme') || 'light'
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
